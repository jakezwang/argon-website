// A dated note for posts written before Argon 2.10.0, which still describe
// that release's limits. The post itself stays as it was on its date.
export default function LaterReleasesNote() {
  return (
    <p>
      <em>
        Update, November 21, 2026. Since this post was written, Argon 2.10.0
        tests importing, following and write-back against sources with access
        control and TLS, across primary elections on a three-member replica
        set, and with MongoDB 6.0 and 8.0, and 2.12.0 adds{" "}
        <a href="/blog/mongodb-atlas-sandbox-review-write-back">
          MongoDB Atlas as a source
        </a>
        , including the free tier; sharded sources are still untested. <code>argon sandbox create --credential</code>{" "}
        gives a sandbox its own MongoDB user, revoked when the sandbox is
        discarded or swept. From 2.11.0 a sandbox builds the source&apos;s
        secondary indexes, so its unique constraints hold as on the source.
        The rest of this post describes the release it names.
      </em>
    </p>
  );
}
