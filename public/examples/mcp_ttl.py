#!/usr/bin/env python3
"""Observe real Argon 2.1.3 sandbox expiry on a disposable local replica set.

Download mcp_review.py into the same directory. Requires Python 3.12+, pymongo,
ARGON_BIN, and ARGON_TEST_MONGODB_URI. Runs for about 2.5 minutes: no clock or
expiry metadata is modified. All processes and databases created here are owned
by this run and removed in finally. Never point this at a shared/production DB.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time
import uuid

from pymongo import MongoClient
from pymongo.uri_parser import parse_uri

sys.dont_write_bytecode = True
from mcp_review import MCP


def main():
    if not __debug__:
        raise SystemExit("Run without -O: this example depends on assertions")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--expected-version", default="2.1.3")
    args = parser.parse_args()
    uri = os.environ.get("ARGON_TEST_MONGODB_URI", "")
    if not uri:
        parser.error("Set ARGON_TEST_MONGODB_URI to a disposable local replica set")
    parsed = parse_uri(uri)
    if parsed["username"] or parsed["password"] or any(
        host not in {"localhost", "127.0.0.1", "::1"} for host, _ in parsed["nodelist"]
    ):
        parser.error("Use a disposable loopback MongoDB without credentials; its URI appears in the trace")
    binary = shutil.which(os.environ.get("ARGON_BIN", "argon"))
    if binary is None:
        parser.error("Set ARGON_BIN to the installed Argon CLI")
    # Refuse to overwrite a prior run's protocol/evidence files.
    args.output_dir.mkdir(parents=True, exist_ok=False)
    token = uuid.uuid4().hex
    project = "ttl-" + token[:12]
    metadata = "argon_ttl_example_" + token
    env = {**os.environ, "MONGODB_URI": uri, "ARGON_METADATA_DB": metadata,
           "ARGON_SNAPSHOT_STORE": "mongodb"}
    mongo = MongoClient(uri, serverSelectionTimeoutMS=10000, socketTimeoutMS=10000)
    physical = set()
    server = None
    project_created = False
    metadata_touched = False
    evidence = {"passed": False, "cases": {}, "cleanup": {"passed": False, "errors": []}}
    cli_log = []

    def cli(*argv):
        result = subprocess.run(
            [binary, *argv, "--output", "json"], env=env,
            capture_output=True, text=True, timeout=60,
        )
        cli_log.append({"args": list(argv), "returncode": result.returncode,
                        "stdout": result.stdout, "stderr": result.stderr})
        if result.returncode:
            raise AssertionError(f"Argon {argv} failed: {result.stderr}")
        return json.loads(result.stdout)

    def start_server(label):
        directory = args.output_dir / label
        directory.mkdir()
        started = time.monotonic()
        instance = MCP(binary, env, directory)
        try:
            result = instance.request("initialize", {
                "protocolVersion": "2024-11-05", "capabilities": {},
                "clientInfo": {"name": "argon-ttl-example", "version": "1.0"},
            })
            assert result["protocolVersion"] == "2024-11-05", result
            instance.notify("notifications/initialized")
        except BaseException:
            instance.close()
            raise
        return instance, started

    def create_mcp(name):
        result = server.tool("argon_sandbox_create", project=project,
                             name=name, ttl_minutes=0.1)
        match = re.search(r"Connection string: (\S+)", result)
        assert match, result
        database = parse_uri(match.group(1))["database"]
        assert database and database.startswith("argon_br_"), database
        physical.add(database)
        cli("collections", "prepare", "sentinel", "--project", project, "--branch", name)
        mongo[database].sentinel.insert_one({"_id": name, "synthetic": True})
        return database

    def present(name, database):
        branches = cli("branches", "list", "--project", project)["branches"]
        return (any(branch["name"] == name for branch in branches)
                and mongo[database].sentinel.count_documents({"_id": name}) == 1)

    def wait_reaped(name, database, started):
        deadline = started + 100
        while time.monotonic() < deadline:
            branches = cli("branches", "list", "--project", project)["branches"]
            if not any(branch["name"] == name for branch in branches):
                assert database not in mongo.list_database_names(), database
                return round(time.monotonic() - started, 3)
            time.sleep(1)
        raise AssertionError(f"Managed sweep did not remove {name} within 100s")

    try:
        version = subprocess.check_output([binary, "--version"], text=True, timeout=15).strip()
        assert version == "argon version " + args.expected_version, version
        evidence.update({"version": version,
                         "binary_sha256": hashlib.sha256(Path(binary).read_bytes()).hexdigest(),
                         "mongodb_version": mongo.server_info()["version"],
                         "real_elapsed_time": True, "cli_ttl_seconds": 3,
                         "mcp_ttl_minutes": 0.1})
        assert mongo.admin.command("hello").get("setName"), "MongoDB must be a replica set"
        metadata_touched = True
        cli("projects", "create", project)
        project_created = True

        # No managed server exists for this run yet. Expiry alone is not deletion.
        created = cli("sandbox", "create", "--project", project,
                      "--name", "cli-only", "--ttl", "3s")
        database = created["physical_db"]
        physical.add(database)
        cli("collections", "prepare", "sentinel", "--project", project, "--branch", "cli-only")
        mongo[database].sentinel.insert_one({"_id": "cli-only", "synthetic": True})
        started = time.monotonic()
        time.sleep(4)
        assert present("cli-only", database), "CLI sandbox disappeared without a sweep"
        report = cli("sandbox", "sweep", "--project", project)
        assert report["reaped"] == ["cli-only"] and not report["skipped"], report
        assert database not in mongo.list_database_names(), database
        evidence["cases"]["cli_requires_sweep"] = {
            "passed": True, "present_after_expiry": True,
            "elapsed_before_sweep_seconds": round(time.monotonic() - started, 3),
            "sweep": report,
        }
        print("PASS: CLI expiry retained data until explicit sandbox sweep", flush=True)

        server, started = start_server("managed")
        database = create_mcp("managed")
        time.sleep(7)
        assert present("managed", database), "Unexpected deletion before first periodic pass"
        elapsed = wait_reaped("managed", database, started)
        evidence["cases"]["managed_periodic_sweep"] = {
            "passed": True, "present_after_expiry": True,
            "removed_seconds_after_server_start": elapsed,
        }
        print(f"PASS: running MCP removed expired sandbox at {elapsed}s", flush=True)

        # Stop only this script's MCP process; the MongoDB fixture stays running.
        database = create_mcp("restart")
        server.close()
        server = None
        stopped = time.monotonic()
        time.sleep(7)
        assert present("restart", database), "Sandbox disappeared while MCP was stopped"
        downtime = round(time.monotonic() - stopped, 3)
        server, started = start_server("restarted")
        time.sleep(2)
        assert present("restart", database), "Unexpected immediate startup sweep"
        elapsed = wait_reaped("restart", database, started)
        evidence["cases"]["restart_periodic_sweep"] = {
            "passed": True, "present_after_expiry_while_stopped": True,
            "stopped_seconds": downtime, "present_two_seconds_after_restart": True,
            "removed_seconds_after_restart": elapsed,
        }
        print(f"PASS: restarted MCP removed old expiry at {elapsed}s, not startup", flush=True)
        evidence["passed"] = True
    finally:
        def cleanup(label, action):
            try:
                action()
            except Exception as error:
                evidence["cleanup"]["errors"].append(label + ": " + str(error))

        try:
            if server is not None:
                cleanup("stop owned MCP child", server.close)
            if project_created:
                # Public CLI discovery also finds a checkout created before
                # a tool/transport error returned its connection string.
                def discover():
                    for branch in cli("branches", "list", "--project", project)["branches"]:
                        if branch.get("physical_db"):
                            physical.add(branch["physical_db"])
                cleanup("discover owned databases", discover)
            for database in physical:
                if not database.startswith("argon_br_"):
                    evidence["cleanup"]["errors"].append("Refused unexpected database: " + database)
                    continue
                cleanup("drop " + database, lambda database=database: mongo.drop_database(database))
            if metadata_touched:
                cleanup("drop owned metadata", lambda: mongo.drop_database(metadata))
            def verify_cleanup():
                remaining = (set(mongo.list_database_names()) & (physical | {metadata})
                             if metadata_touched else set())
                evidence["cleanup"]["owned_databases_remaining"] = len(remaining)
                assert not remaining, remaining
            cleanup("verify owned database cleanup", verify_cleanup)
            evidence["cleanup"]["passed"] = not evidence["cleanup"]["errors"]
        finally:
            mongo.close()
            evidence["passed"] = evidence["passed"] and evidence["cleanup"]["passed"]
            (args.output_dir / "cli.json").write_text(json.dumps(cli_log, indent=2) + "\n")
            (args.output_dir / "verification.json").write_text(json.dumps(evidence, indent=2) + "\n")
    if not evidence["passed"]:
        raise RuntimeError("TTL verification or cleanup failed; see verification.json")
    print(json.dumps(evidence, indent=2))


if __name__ == "__main__":
    main()
