#!/usr/bin/env python3
"""Exercise Argon's MongoDB sandbox, diff and discard using synthetic orders."""
import json
import shutil
import signal
import subprocess
import sys
import time
import uuid
from contextlib import ExitStack, contextmanager


RUN_ID = uuid.uuid4().hex
LABEL = "tech.argonlabs.order-review=" + RUN_ID
DB = "argon-order-db-" + RUN_ID
CLI = "argon-order-cli-" + RUN_ID
# Multi-architecture Docker Hub image indexes for mongo:7 and node:24-bookworm.
MONGO_IMAGE = "mongo@sha256:6c126fa33b12bce7e51580f3e6d689da36ae7ebb49ae44ff83095665023d1ecd"
NODE_IMAGE = "node@sha256:9d266751ca3d7fdbe651c878ffd5ad0a42fed49a18c283509267c97f025b7496"
URI = "mongodb://localhost:27017/?replicaSet=rs0"
PROJECT = "return-review"
APPROVED_ORDER = "order-17"
FIXTURE = [{"_id": key, "status": "delivered"} for key in (APPROVED_ORDER, "order-23")]


def docker(*args, timeout=90):
    result = subprocess.run(["docker", *args], capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result.stdout.strip()


@contextmanager
def container(name, *args):
    # Register cleanup before creation so an interrupted image pull or start is safe.
    try:
        docker("run", "-d", "--name", name, "--label", LABEL, *args, timeout=600)
        yield
    finally:
        owned = docker("ps", "-aq", "--filter", "label=" + LABEL, "--filter", "name=^/" + name + "$")
        if owned:
            docker("rm", "-fv", owned)


def mongo(code):
    return docker("exec", DB, "mongosh", "--quiet", "--eval", code)


def argon(*args):
    return docker("exec", CLI, "argon", *args)


def until(check, label):
    deadline = time.monotonic() + 60
    last_error = None
    while time.monotonic() < deadline:
        try:
            result = check()
        except RuntimeError as exc:
            last_error = exc
        else:
            if result:
                return result
        time.sleep(0.5)
    raise RuntimeError(f"Timed out waiting for {label}. Last error: {last_error or 'none'}")


def verify(condition, message):
    if not condition:
        raise ValueError(message)


def branches():
    rows = json.loads(argon("branches", "list", "-p", PROJECT, "-o", "json"))["branches"]
    return {row["name"]: row["physical_db"] for row in rows}


def orders(db_name):
    collection = f'db.getSiblingDB({json.dumps(db_name)}).orders'
    return json.loads(mongo(f'JSON.stringify({collection}.find().sort({{_id:1}}).toArray())'))


def review(branch, parent_db, selected_ids):
    argon("sandbox", "create", "-p", PROJECT, "--name", branch, "--ttl", "1h")
    db_name = branches()[branch]
    verify(orders(db_name) == FIXTURE, "Sandbox started with unexpected orders")

    # Stand in for the write a support agent would make. Run the real MongoDB operation.
    collection = f'db.getSiblingDB({json.dumps(db_name)}).orders'
    query = json.dumps({"_id": {"$in": selected_ids}})
    update = json.dumps({"$set": {"status": "return_requested"}})
    modified = int(mongo(f'{collection}.updateMany({query},{update}).modifiedCount'))
    verify(modified == len(selected_ids), "Unexpected MongoDB write result")

    def captured():
        plan = json.loads(argon("diff", "-p", PROJECT, "-b", branch, "-o", "json"))["plan"]
        verify(not plan.get("conflicts"), "Sandbox has a merge conflict")
        changes = plan.get("changes") or []
        if len(changes) >= modified:
            return changes
        return None

    changed = {}
    for change in until(captured, "the captured writes"):
        doc = change["document"]
        key = doc["_id"]
        verify(change["collection"] == "orders", "Unexpected collection in diff")
        verify(change["before"] == {"_id": key, "status": "delivered"}, "Unexpected before image")
        verify(doc == {"_id": key, "status": "return_requested"}, "Unexpected after image")
        verify(key not in changed, "Duplicate order in diff")
        changed[key] = f"{key} {change['before']['status']} -> {doc['status']}"
    verify(sorted(changed) == sorted(selected_ids), "Diff disagrees with the worker's actual writes")
    unexpected = sorted(set(changed) - {APPROVED_ORDER})
    print(f"{branch}: {len(changed)} changed | " + ", ".join(changed[k] for k in sorted(changed)))
    print("  Scope verdict:", "REJECT; unexpected " + ", ".join(unexpected) if unexpected else "WITHIN REQUEST")

    argon("sandbox", "discard", "-p", PROJECT, "-b", branch)
    verify(branch not in branches(), "Discarded sandbox is still listed")
    remaining_dbs = json.loads(mongo("JSON.stringify(db.getMongo().getDBNames())"))
    verify(db_name not in remaining_dbs, "Discarded MongoDB database still exists")
    verify(orders(parent_db) == FIXTURE and orders("fixture") == FIXTURE, "Parent or fixture changed")
    print("  Discarded; physical sandbox removed; main and original fixture match initial values.")


def main():
    if not shutil.which("docker"):
        raise RuntimeError("Install Docker with Linux container support, start it, and rerun.")
    docker("info", "--format", "{{.ServerVersion}}")
    print("Starting fresh Docker containers. The first run may need to download images.", file=sys.stderr)
    with ExitStack() as cleanup:
        cleanup.enter_context(container(DB, MONGO_IMAGE, "--replSet", "rs0", "--bind_ip", "127.0.0.1"))
        cleanup.enter_context(container(CLI, "--network", "container:" + DB, "-e", "MONGODB_URI=" + URI,
                                        NODE_IMAGE, "sleep", "infinity"))
        docker("exec", CLI, "npm", "install", "-g", "argonctl@2.8.1", "--allow-scripts=argonctl", timeout=300)
        until(lambda: mongo("db.runCommand({ping:1}).ok") == "1", "MongoDB")
        mongo('rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})')
        until(lambda: mongo("db.hello().isWritablePrimary") == "true", "replica set primary")
        version = argon("--version")
        verify(version == "argon version 2.8.1", "Unexpected Argon version: " + version)
        print(version, "| MongoDB", mongo("db.version()"))

        mongo(f'db.getSiblingDB("fixture").orders.insertMany({json.dumps(FIXTURE)})')
        argon("import", "database", "--uri", URI, "--database", "fixture", "--project", PROJECT,
              "--source-quiesced", "--yes")
        argon("checkout", "-p", PROJECT, "-b", "main")
        parent_db = branches()["main"]
        verify(orders(parent_db) == FIXTURE, "Parent bootstrap failed")
        docker("exec", "-d", CLI, "sh", "-c", "exec argon console --no-browser >/tmp/console.log 2>&1")
        until(lambda: docker("exec", CLI, "curl", "-fsS", "http://localhost:1818/health"), "Argon")
        print("Task: request a return for order-17 only.")
        review("correct", parent_db, [APPROVED_ORDER])
        review("overbroad", parent_db, [APPROVED_ORDER, "order-23"])
    print("PASS | Both workflows verified. Temporary Docker containers and volumes removed.")


def stop(signum, frame):
    raise KeyboardInterrupt


if __name__ == "__main__":
    signal.signal(signal.SIGTERM, stop)
    try:
        main()
    except KeyboardInterrupt:
        sys.exit("Interrupted.")
    except (OSError, RuntimeError, ValueError, subprocess.TimeoutExpired) as exc:
        sys.exit("FAILED: " + str(exc))
