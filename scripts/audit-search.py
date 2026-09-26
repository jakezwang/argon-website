#!/usr/bin/env python3
"""Read-only, no-JavaScript crawl of the public sitemap. No dependencies.

HTTP crawlability is not proof of search indexing or real crawler access.
Run: python3 scripts/audit-search.py --origin https://argonlabs.tech --output report.json
"""
import argparse
import datetime as dt
import json
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.h1 = []
        self.meta = {}
        self.canonicals = []
        self.links = []
        self.schemas = []
        self.capture = None
        self.buffer = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("title", "h1") or (tag == "script" and attrs.get("type") == "application/ld+json"):
            self.capture = tag
            self.buffer = ""
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property", "")).lower()] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])

    def handle_data(self, data):
        if self.capture:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag != self.capture:
            return
        if tag == "title":
            self.title = self.buffer.strip()
        elif tag == "h1":
            self.h1.append(self.buffer.strip())
        else:
            self.schemas.append(json.loads(self.buffer))
        self.capture = None


def fetch(url, agent="ArgonSearchAudit/1.0"):
    try:
        response = urlopen(Request(url, headers={"User-Agent": agent}), timeout=30)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.geturl(), dict(response.headers), response.read().decode("utf-8", errors="replace")


def run(origin):
    canonical_origin = "https://argonlabs.tech"
    report = {"checked_at": dt.datetime.now(dt.timezone.utc).isoformat(), "origin": origin,
              "method": "GET-only raw HTML; no JS execution; not a search-index or verified crawler-IP test",
              "pages": [], "errors": [], "warnings": []}
    def check(condition, message):
        if not condition:
            report["errors"].append(message)

    status, _, _, robots_text = fetch(origin + "/robots.txt")
    check(status == 200, "robots.txt must return 200")
    robots = RobotFileParser()
    robots.parse(robots_text.splitlines())
    report["robots"] = robots_text
    status, _, _, sitemap_text = fetch(origin + "/sitemap.xml")
    check(status == 200, "sitemap.xml must return 200")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    entries = ElementTree.fromstring(sitemap_text).findall("s:url", ns)
    check(bool(entries), "sitemap is empty")
    seen = set()
    internal = set()
    titles, descriptions = [], []
    for entry in entries:
        canonical = entry.findtext("s:loc", namespaces=ns)
        path = urlsplit(canonical).path or "/"
        check(urlsplit(canonical).netloc == "argonlabs.tech", f"wrong sitemap host: {canonical}")
        check(canonical not in seen, f"duplicate sitemap URL: {canonical}")
        seen.add(canonical)
        status, final, headers, html = fetch(origin + path)
        page = Page()
        page.feed(html)
        check(status == 200, f"{path}: HTTP {status}")
        check(urlsplit(final).path == path, f"{path}: redirects to {final}")
        check(len(page.h1) == 1 and bool(page.h1[0]), f"{path}: requires one raw-HTML H1")
        check(bool(page.title), f"{path}: missing title")
        check(bool(page.meta.get("description")), f"{path}: missing description")
        check(page.canonicals == [canonical_origin + (path if path != "/" else "")]
              or page.canonicals == [canonical_origin + path], f"{path}: wrong canonical {page.canonicals}")
        directives = " ".join([page.meta.get("robots", ""), page.meta.get("googlebot", ""),
                               next((v for k, v in headers.items() if k.lower() == "x-robots-tag"), "")]).lower()
        check("noindex" not in directives, f"{path}: noindex")
        check("nosnippet" not in directives, f"{path}: nosnippet")
        for agent in ("Googlebot", "bingbot", "OAI-SearchBot", "PerplexityBot"):
            check(robots.can_fetch(agent, canonical), f"{path}: robots blocks {agent}")
        check(bool(page.schemas), f"{path}: missing JSON-LD")
        titles.append(page.title)
        descriptions.append(page.meta.get("description"))
        for link in page.links:
            parsed = urlsplit(urljoin(canonical, link))
            if parsed.netloc == "argonlabs.tech" and not parsed.query:
                internal.add(parsed.path or "/")
        lastmod = entry.findtext("s:lastmod", namespaces=ns)
        if lastmod:
            check(dt.datetime.fromisoformat(lastmod.replace("Z", "+00:00")).date() <= dt.datetime.now(dt.timezone.utc).date(), f"{path}: future lastmod")
        report["pages"].append({"path": path, "status": status, "title": page.title,
                                "description": page.meta.get("description"), "h1": page.h1,
                                "canonical": page.canonicals, "lastmod": lastmod})
    for label, values in (("title", titles), ("description", descriptions)):
        for value, count in Counter(values).items():
            check(count == 1, f"duplicate {label}: {value}")
    known = {urlsplit(url).path or "/" for url in seen}
    for path in sorted(internal - known):
        status, _, _, _ = fetch(origin + path)
        check(status < 400, f"broken internal page link: {path} ({status})")
    status, _, _, llms = fetch(origin + "/llms.txt")
    check(status == 200 and "# Argon" in llms, "llms.txt missing or invalid")
    missing_guides = [path for path in known if path.startswith("/blog/") and path not in llms]
    if missing_guides:
        report["warnings"].append({"guides_missing_from_llms": sorted(missing_guides)})
    status, _, _, _ = fetch(origin + "/__argon_search_audit_missing_page__")
    check(status == 404, f"unknown route should return 404, got {status}")
    report["page_count"] = len(report["pages"])
    report["passed"] = not report["errors"]
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="http://127.0.0.1:13000")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    try:
        report = run(args.origin.rstrip("/"))
    except Exception as error:
        report = {"origin": args.origin, "passed": False, "errors": [f"Audit incomplete: {error}"]}
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({k: v for k, v in report.items() if k in ("passed", "page_count", "errors", "warnings")}))
    sys.exit(0 if report["passed"] else 1)
