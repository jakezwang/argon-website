// A dated note for posts written before Argon 2.9.0, which still describe
// that release's limits. The post itself stays as it was on its date.
export default function LaterReleasesNote() {
  return (
    <p>
      <em>
        Update, November 23, 2026. Since this post was written, Argon 2.9.0 adds{" "}
        <code>argon merge check</code>, which reports unique-key collisions
        before a write-back, and 2.10.0 tests importing, following and
        write-back against sources with access control and TLS, across primary
        elections on a three-member replica set, and with MongoDB 6.0 and 8.0,
        and 2.12.0 adds MongoDB Atlas sources, including the free M0 tier and
        dedicated replica-set M10 clusters. From 2.13.0 the engine is also
        tested on Atlas M0. Sharded sources are unsupported.{" "}
        <code>argon sandbox create --credential</code> gives a sandbox its own
        MongoDB user, revoked when the sandbox is discarded or swept; it needs
        an authenticated engine connection and is refused when the engine runs
        on Atlas. From 2.11.0 a sandbox builds the source&apos;s secondary
        indexes, so its unique constraints hold as on the source; indexes are
        not versioned, and a merge does not carry index changes. The rest of
        this post describes the release it names.
      </em>
    </p>
  );
}
