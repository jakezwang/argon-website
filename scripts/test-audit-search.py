"""Regression checks for failures hidden by successful HTTP responses."""
import importlib.util
from email.message import Message
from io import BytesIO
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("audit_search", Path(__file__).with_name("audit-search.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def document(path, body):
    return (f'<title>{path}</title><meta name="description" content="Page {path}">'
            f'<link rel="canonical" href="https://argonlabs.tech{path}">'
            '<script type="application/ld+json">{"@type":"WebPage"}</script>'
            f'<h1>{path}</h1><main>{body}</main>')


class ContentAuditTests(unittest.TestCase):
    def run_audit(self, home, guide):
        routes = {
            "/robots.txt": "User-agent: *\nAllow: /",
            "/sitemap.xml": '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
                            '<url><loc>https://argonlabs.tech/</loc></url>'
                            '<url><loc>https://argonlabs.tech/guide</loc></url></urlset>',
            "/": document("/", home),
            "/guide": document("/guide", guide),
            "/llms.txt": "# Argon",
        }
        def fetch(url, agent=None):
            path = audit.urlsplit(url).path
            return (200 if path in routes else 404, url, {}, routes.get(path, "Not found"))
        with patch.object(audit, "fetch", side_effect=fetch):
            return audit.run("https://argonlabs.tech")

    def test_encoded_fragment_and_text_directive(self):
        report = self.run_audit('<a href="/guide#review%20changes:~:text=Review">Guide</a>',
                                '<h2 id="review changes">Review</h2><a href="/">Home</a>')
        self.assertTrue(report["passed"], report["errors"])
        self.assertEqual(report["content_links"]["unique_fragment_targets"], 1)

    def test_restrictive_meta_survives_later_permissive_tag(self):
        for name, rule in (("robots", "noindex"), ("Googlebot", "nosnippet"), ("bingbot", "noindex")):
            with self.subTest(name=name):
                report = self.run_audit(
                    f'<meta name="{name}" content="{rule}">'
                    f'<meta name="{name}" content="index,follow"><a href="/guide">Guide</a>',
                    '<a href="/">Home</a>')
                self.assertIn(f"/: {rule}", report["errors"])

    def test_none_blocks_indexing_but_image_preview_none_does_not(self):
        for rule, blocked in (("NONE", True), ("max-image-preview:none", False)):
            with self.subTest(rule=rule):
                report = self.run_audit(
                    f'<meta name="robots" content="{rule}"><a href="/guide">Guide</a>',
                    '<a href="/">Home</a>')
                self.assertEqual("/: noindex" in report["errors"], blocked)

    def test_fetch_preserves_repeated_robots_headers(self):
        response = BytesIO(b"body")
        response.status = 200
        response.geturl = lambda: "https://argonlabs.tech/"
        response.headers = Message()
        response.headers.add_header("X-Robots-Tag", "noindex")
        response.headers.add_header("X-Robots-Tag", "index")
        with patch.object(audit, "urlopen", return_value=response):
            _, _, headers, _ = audit.fetch("https://argonlabs.tech/")
        self.assertEqual(headers["X-Robots-Tag"], "noindex, index")

    def test_http_200_does_not_hide_missing_fragment(self):
        report = self.run_audit('<a href="/guide#deleted">Guide</a>', '<a href="/">Home</a>')
        self.assertFalse(report["passed"])
        self.assertIn("/: broken internal fragment /guide#deleted", report["errors"])

    def test_script_only_main_and_self_link_do_not_satisfy_content_or_inbound(self):
        report = self.run_audit('<script>not body content</script><style>p{}</style>',
                               '<a href="/guide">Self</a><a href="/">Home</a>')
        self.assertIn("/: missing raw-HTML main content", report["errors"])
        self.assertIn("/guide: no inbound link from another sitemap page", report["errors"])


if __name__ == "__main__":
    unittest.main()
