#!/usr/bin/env python3
"""Exercise application-level catalog validation against public Argon 2.1.6.
Requires Python 3.12+, pymongo>=4.6,<5 and a disposable local MongoDB replica set.
Run --scenario valid|invalid-value|unexpected-field|extra-document|delete-document
with --mongo-uri and a fresh --output-dir. The valid fixture is automatically
merged into its own synthetic parent; invalid fixtures are discarded.
No model, production connection, human approval or native business-rule gate.
Only this run's databases are removed. JSON evidence remains on disk.
"""
import argparse
import json
import os
from pathlib import Path
import queue
import re
import subprocess
import threading
import uuid

from pymongo import MongoClient
from pymongo.uri_parser import parse_uri
from pymongo.write_concern import WriteConcern


class MCP:
    """Bounded sequential stdio client for this example, not a general MCP SDK."""

    def __init__(self, binary, env, output_dir):
        self.trace = (output_dir / "protocol.jsonl").open("x", encoding="utf-8")
        self.stderr = (output_dir / "server.stderr.log").open("x", encoding="utf-8")
        self.proc = subprocess.Popen([binary, "mcp"], env=env, stdin=subprocess.PIPE,
                                     stdout=subprocess.PIPE, stderr=self.stderr)
        self.responses = queue.Queue()
        self.next_id = 0
        threading.Thread(target=self._read, daemon=True).start()

    def _read(self):
        try:
            while True:
                line = self.proc.stdout.readline(1024 * 1024 + 1)
                if not line:
                    raise EOFError("MCP stdout closed; see server.stderr.log")
                if len(line) > 1024 * 1024 or not line.endswith(b"\n"):
                    raise ValueError("MCP message exceeded the example's 1 MiB limit")
                self.responses.put(json.loads(line))
        except Exception as error:
            self.responses.put(error)

    def _record(self, direction, message):
        self.trace.write(json.dumps({"direction": direction, "message": message}) + "\n")
        self.trace.flush()

    def _send(self, message):
        self.proc.stdin.write((json.dumps(message) + "\n").encode())
        self.proc.stdin.flush()
        self._record("client->server", message)

    def notify(self, method, params=None):
        message = {"jsonrpc": "2.0", "method": method}
        if params is not None:
            message["params"] = params
        self._send(message)

    def request(self, method, params=None):
        self.next_id += 1
        message = {"jsonrpc": "2.0", "id": self.next_id, "method": method}
        if params is not None:
            message["params"] = params
        self._send(message)
        try:
            reply = self.responses.get(timeout=60)
        except queue.Empty:
            self.notify("notifications/cancelled", {"requestId": self.next_id, "reason": "timeout"})
            raise TimeoutError("MCP request timed out: " + method) from None
        if isinstance(reply, Exception):
            raise reply
        self._record("server->client", reply)
        if reply.get("jsonrpc") != "2.0" or reply.get("id") != self.next_id:
            raise ValueError("Unexpected MCP response: " + repr(reply))
        if "error" in reply:
            raise RuntimeError("MCP protocol error: " + repr(reply["error"]))
        return reply["result"]

    def tool(self, tool_name, **arguments):
        result = self.request("tools/call", {"name": tool_name, "arguments": arguments})
        text = "\n".join(item["text"] for item in result.get("content", []) if item.get("type") == "text")
        if result.get("isError"):
            raise RuntimeError(tool_name + ": " + text)
        print(tool_name + ": " + text, flush=True)
        return text

    def close(self):
        # MCP stdio shutdown: close input, then escalate only our child if stuck.
        try:
            self.proc.stdin.close()
        except BrokenPipeError:
            pass
        try:
            self.proc.wait(timeout=40)
        except subprocess.TimeoutExpired:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.proc.kill()
                self.proc.wait(timeout=10)
        self.proc.stdout.close()
        self.stderr.close()
        self.trace.close()
        if self.proc.returncode:
            raise RuntimeError(f"MCP process exited {self.proc.returncode}; see server.stderr.log")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def review_catalog_plan(plan, baseline):
    """Fail closed for this one-document, fixed-currency enrichment contract."""
    if plan.get("status") != "pending" or plan.get("conflicts"):
        return ["plan_not_ready"]
    changes = plan.get("changes")
    if not isinstance(changes, list) or len(changes) != 1:
        return ["unexpected_change_count"]
    change = changes[0]
    if (change.get("collection") != "products" or change.get("document_id") != "shoe"
            or change.get("delete") or change.get("before") != baseline):
        return ["unexpected_target_or_operation"]
    doc = change.get("document")
    allowed = {"_id", "price_cents", "currency", "discount_bps", "sale_price_cents"}
    if not isinstance(doc, dict) or set(doc) != allowed:
        return ["unexpected_fields"]
    if any(doc[k] != baseline[k] or type(doc[k]) is not type(baseline[k]) for k in baseline):
        return ["immutable_fields_changed"]
    if type(doc["discount_bps"]) is not int or not 0 <= doc["discount_bps"] <= 10000:
        return ["invalid_discount"]
    # This fixture's explicit policy is integer cents, rounded down.
    expected = doc["price_cents"] * (10000 - doc["discount_bps"]) // 10000
    if type(doc["sale_price_cents"]) is not int or doc["sale_price_cents"] != expected:
        return ["invalid_derived_price"]
    return []


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--binary", default=os.environ.get("ARGON_BIN", "argon"))
    parser.add_argument("--mongo-uri", default=os.environ.get("ARGON_TEST_MONGODB_URI"),
                        help="Disposable local replica set, without credentials; or ARGON_TEST_MONGODB_URI")
    parser.add_argument("--expected-version", default="2.1.6", help="Exact release to validate (default: %(default)s)")
    parser.add_argument("--output-dir", type=Path, required=True, help="New directory for real protocol messages and results")
    parser.add_argument("--scenario", choices=["valid", "invalid-value", "unexpected-field", "extra-document", "delete-document"], required=True)
    args = parser.parse_args()
    if not args.mongo_uri:
        parser.error("Supply --mongo-uri or ARGON_TEST_MONGODB_URI")
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", args.expected_version):
        parser.error("--expected-version must be an exact stable release")
    uri = parse_uri(args.mongo_uri)
    if uri["username"] or uri["password"] or any(host not in {"localhost", "127.0.0.1", "::1"} for host, _ in uri["nodelist"]):
        parser.error("Use a disposable local replica set without credentials; its URI appears in the trace")
    args.output_dir.mkdir(parents=True, exist_ok=False)
    token = uuid.uuid4().hex
    project, metadata = "mcp-review-" + token, "argon_mcp_review_" + token
    env = {**os.environ, "MONGODB_URI": args.mongo_uri, "ARGON_METADATA_DB": metadata,
           "ARGON_SNAPSHOT_STORE": "mongodb"}
    mongo = MongoClient(args.mongo_uri, serverSelectionTimeoutMS=10000, socketTimeoutMS=10000)
    clients, physical = [], set()
    mcp = None
    project_created = False
    report = {"complete": False, "decision": "not_decided",
              "project": project, "metadata_database": metadata, "cleanup_errors": []}
    failure = None

    def cli(*words):
        result = subprocess.run([args.binary, *words, "--output", "json"], env=env,
                                text=True, capture_output=True, timeout=60, check=True)
        return json.loads(result.stdout)

    def connection(text):
        match = re.search(r"^Connection string: (.+)$", text, re.MULTILINE)
        if not match:
            raise ValueError("Missing connection string in MCP result")
        client = MongoClient(match[1], serverSelectionTimeoutMS=10000, socketTimeoutMS=10000)
        clients.append(client)
        database = client.get_default_database(write_concern=WriteConcern(w="majority"))
        physical.add(database.name)
        return database

    try:
        version = subprocess.check_output([args.binary, "--version"], env=env, text=True, timeout=10).strip()
        if version != "argon version " + args.expected_version:
            raise ValueError("Expected Argon " + args.expected_version + "; got " + version)
        report["binary_version"] = version
        mongo.admin.command("ping")
        report["mongodb_version"] = mongo.server_info()["version"]
        cli("projects", "create", project)
        project_created = True
        checkout = cli("checkout", "-p", project, "-b", "main")
        physical.add(checkout["physical_db"])
        cli("collections", "prepare", "products", "-p", project, "-b", "main")

        mcp = MCP(args.binary, env, args.output_dir)
        initialized = mcp.request("initialize", {
            "protocolVersion": "2024-11-05", "capabilities": {},
            "clientInfo": {"name": "argon-scripted-review-example", "version": "1.0.0"},
        })
        require(initialized["protocolVersion"] == "2024-11-05" and "tools" in initialized["capabilities"], 'Fixture check failed: initialized["protocolVersion"] == "2024-11-05" and "tools" in initialized["capabilities"]')
        report["initialize"] = initialized  # serverInfo.version is not the CLI release version.
        mcp.notify("notifications/initialized")
        tools = mcp.request("tools/list")["tools"]
        report["tools"] = [tool["name"] for tool in tools]
        required = {"argon_connect", "argon_sandbox_create", "argon_diff", "argon_merge_preview",
                    "argon_merge_apply", "argon_sandbox_discard"}
        require(required <= set(report["tools"]), 'Fixture check failed: required <= set(report["tools"])')

        main_db = connection(mcp.tool("argon_connect", project=project, branch="main"))
        baseline = {"_id": "shoe", "price_cents": 4900, "currency": "USD"}
        main_db.products.insert_one(baseline)
        proposal = connection(mcp.tool("argon_sandbox_create", project=project, **{
            "from": "main", "name": "review", "ttl_minutes": 60, "actor": "catalog-fixture",
        }))
        candidate = {**baseline, "discount_bps": 1000, "sale_price_cents": 4410}
        if args.scenario == "invalid-value":
            candidate["sale_price_cents"] = 4400
        if args.scenario == "unexpected-field":
            candidate["supplier_cost_cents"] = 2000
        proposal.products.replace_one({"_id": "shoe"}, candidate)
        if args.scenario == "extra-document":
            proposal.products.insert_one({"_id": "unrequested", "price_cents": 100})
        if args.scenario == "delete-document":
            proposal.products.delete_one({"_id": "shoe"})
        require(list(main_db.products.find()) == [baseline], "parent changed before preview")
        preview = mcp.tool("argon_merge_preview", project=project, branch="review")
        match = re.search(r"Merge plan ([0-9a-f]{24}) ", preview)
        require(match and "0 conflict(s)" in preview, 'Fixture check failed: match and "0 conflict(s)" in preview')
        plan_id = match[1]
        plan = next(p for p in cli("merge", "list", "-p", project)["plans"] if p["id"] == plan_id)
        (args.output_dir / "reviewed-plan.json").write_text(json.dumps(plan, indent=2) + "\n")
        require(not plan["conflicts"], "fixture unexpectedly has conflicts")
        reasons = review_catalog_plan(plan, baseline)
        accepted = not reasons
        require(accepted == (args.scenario == "valid"), 'Fixture check failed: accepted == (args.scenario == "valid")')
        require(list(main_db.products.find()) == [baseline], 'Fixture check failed: list(main_db.products.find()) == [baseline]')
        if accepted:
            mcp.tool("argon_merge_apply", plan_id=plan_id)
        expected = candidate if accepted else baseline
        require(list(main_db.products.find()) == [expected], 'Fixture check failed: list(main_db.products.find()) == [expected]')
        mcp.tool("argon_sandbox_discard", project=project, branch="review")
        require(proposal.name not in mongo.list_database_names(), 'Fixture check failed: proposal.name not in mongo.list_database_names()')
        require(list(main_db.products.find()) == [expected], 'Fixture check failed: list(main_db.products.find()) == [expected]')
        report.update(scenario=args.scenario, accepted=accepted, reasons=reasons,
                      conflicts=0, baseline=baseline, candidate=candidate, final_document=expected,
                      workflow_passed=True, decision="apply" if accepted else "reject")
        print("PASS: " + args.scenario + ": " + json.dumps(reasons), flush=True)
    except BaseException as error:
        failure = error
        report["error"] = str(error) or type(error).__name__
    finally:
        def cleanup(label, action):
            try:
                action()
            except Exception as error:
                report["cleanup_errors"].append(label + ": " + str(error))

        if mcp is not None:
            cleanup("stop owned MCP child", mcp.close)
        for client in clients:
            client.close()
        if project_created:
            # Public CLI discovery also finds a checkout created before a tool
            # failed to return its URI. Never inspect or drop unrelated data.
            def discover():
                for branch in cli("branches", "list", "-p", project)["branches"]:
                    if branch.get("physical_db"):
                        physical.add(branch["physical_db"])
            cleanup("discover owned databases", discover)
        for name in physical:
            if name.startswith("argon_br_"):
                cleanup("drop " + name, lambda name=name: mongo.drop_database(name))
        cleanup("drop owned metadata", lambda: mongo.drop_database(metadata))
        mongo.close()
        report["complete"] = failure is None and not report["cleanup_errors"]
        (args.output_dir / "summary.json").write_text(json.dumps(report, indent=2) + "\n")
    if failure is not None:
        raise failure
    if report["cleanup_errors"]:
        raise RuntimeError("Cleanup incomplete; see summary.json")
    print("Cleaned up only this run's fixture databases; evidence: " + str(args.output_dir), flush=True)


if __name__ == "__main__":
    main()
