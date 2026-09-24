#!/usr/bin/env python3
"""Run the site's shared CLI examples on an isolated local MongoDB replica set.

Requires pymongo, a released argon binary, and ARGON_TEST_MONGODB_URI.
Creates and removes only this run's metadata and physical branch databases.
"""
import json
import os
import re
from pathlib import Path
import shlex
import signal
import select
import time
import subprocess
import sys
import tempfile
import uuid
from string import Template

from pymongo import MongoClient
from pymongo.uri_parser import parse_uri

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = json.loads((ROOT / "app/cli-examples.json").read_text())
RELEASE = json.loads((ROOT / "app/release.json").read_text())
uri = os.environ.get("ARGON_TEST_MONGODB_URI")
if not uri:
    raise SystemExit("Set ARGON_TEST_MONGODB_URI to a disposable local MongoDB replica set")
if any(host not in {"localhost", "127.0.0.1", "::1"} for host, _ in parse_uri(uri)["nodelist"]):
    raise SystemExit("CLI example smoke tests only accept a local MongoDB deployment")
argon = os.environ.get("ARGON_BIN", "argon")
metadata = "argon_website_docs_" + uuid.uuid4().hex
mongo = MongoClient(uri, serverSelectionTimeoutMS=10000, socketTimeoutMS=10000)
mongo.admin.command("ping")
env = {**os.environ, "MONGODB_URI": uri, "ARGON_METADATA_DB": metadata}
physical = set()
watchers = []


def run(key, structured=False):
    command = Template(EXAMPLES[key]).substitute(env)
    args = shlex.split(command)
    args[0] = argon
    if structured:
        args += ["--output", "json"]
    result = subprocess.run(args, env=env, text=True, capture_output=True, timeout=60)
    if result.returncode:
        raise AssertionError(f"{key} failed: {result.stderr}\n{result.stdout}")
    if structured:
        data = json.loads(result.stdout)
        if data.get("physical_db"):
            physical.add(data["physical_db"])
        return data
    return result.stdout


def watch(key):
    args = shlex.split(EXAMPLES[key])
    args[0] = argon
    proc = subprocess.Popen(args, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, start_new_session=True)
    watchers.append(proc)
    deadline = time.monotonic() + 30
    startup = []
    while time.monotonic() < deadline:
        if select.select([proc.stdout], [], [], 1)[0]:
            chunk = os.read(proc.stdout.fileno(), 4096).decode()
            startup.append(chunk)
            if "Watching for changes" in "".join(startup):
                return proc
            if not chunk and proc.poll() is not None:
                break
    raise AssertionError("capture did not start: " + "".join(startup))


try:
    version = subprocess.check_output([argon, "--version"], text=True)
    assert RELEASE["version"] in version, (version, RELEASE["version"])
    # The visual terminal contains abbreviated sample output, but every shown
    # Argon command must still use a command/flag supported by this release.
    demo_source = (ROOT / "app/components/InteractiveDemo.tsx").read_text()
    for raw in re.findall(r'command:\s*("(?:[^"\\]|\\.)*")', demo_source):
        command = json.loads(raw)
        if command.startswith("argon "):
            result = subprocess.run([argon, *shlex.split(command)[1:], "--help"], env=env, text=True, capture_output=True, timeout=30)
            assert result.returncode == 0, f"Unsupported illustrated command: {command}: {result.stderr}"
    run("project", True)
    main = run("checkout", True)
    run("prepare")
    watch("watch")
    main_db = mongo[main["physical_db"]]
    main_db.orders.insert_one({"_id": "order-1", "price": 49})

    # Execute the exact published shell pipeline, including JSON parsing.
    with tempfile.TemporaryDirectory(prefix="argon-docs-path-") as path:
        import shutil
        Path(path, "argon").symlink_to(Path(shutil.which(argon) or argon).resolve())
        Path(path, "python3").symlink_to(sys.executable)
        baseline_env = {**env, "PATH": path + os.pathsep + env.get("PATH", "")}
        baseline = subprocess.check_output(
            ["bash", "-euo", "pipefail", "-c", EXAMPLES["baseline"] + '\nprintf "%s" "$BASELINE_LSN"'],
            env=baseline_env, text=True, timeout=60,
        )
    assert int(baseline) > 0, baseline
    env["BASELINE_LSN"] = baseline

    sandbox = run("sandbox", True)
    watch("watchSandbox")
    sandbox_db = mongo[sandbox["physical_db"]]
    assert sandbox_db.orders.find_one({"_id": "order-1"})["price"] == 49
    sandbox_db.orders.update_one({"_id": "order-1"}, {"$set": {"price": 44}})
    diff = run("diff")
    assert "orders/order-1" in diff and "1 change(s), 0 conflict(s)" in diff, diff
    preview = run("mergePreview")
    assert "orders/order-1" in preview and "saved (pending)" in preview, preview
    assert main_db.orders.find_one({"_id": "order-1"})["price"] == 49

    main_db.orders.update_one({"_id": "order-1"}, {"$set": {"price": 75}})
    assert "Target:" in run("restorePreview")
    assert 'Created branch "recovered"' in run("restoreBranch")
    recovered = run("checkoutRecovered", True)
    assert mongo[recovered["physical_db"]].orders.find_one({"_id": "order-1"})["price"] == 49
    assert main_db.orders.find_one({"_id": "order-1"})["price"] == 75
    assert "Nothing expired" in run("sweep")
    for proc in watchers:
        assert proc.poll() is None, "capture process exited unexpectedly: " + proc.stdout.read()
    print("PASS: published CLI commands capture native writes, isolate the sandbox, preview a real diff/merge, and materialize the retained baseline without resetting main")
finally:
    for proc in watchers:
        if proc.poll() is None:
            os.killpg(proc.pid, signal.SIGINT)
            try:
                proc.communicate(timeout=10)
            except subprocess.TimeoutExpired:
                os.killpg(proc.pid, signal.SIGKILL)
                proc.communicate(timeout=10)
    # Include databases created before a failed command could return its JSON.
    for branch in mongo[metadata].branches.find({}, {"physical_db": 1}):
        if branch.get("physical_db"):
            physical.add(branch["physical_db"])
    for name in physical:
        if name.startswith("argon_br_"):
            mongo.drop_database(name)
    mongo.drop_database(metadata)
    mongo.close()
