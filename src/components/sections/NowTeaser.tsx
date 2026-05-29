import Link from "next/link";

import { SectionHeader } from "./SectionHeader";

/**
 * NowTeaser
 *
 * Short snapshot of what Casey is up to, rendered on the homepage. The
 * full Sivers-style /now content lives at /now, which is the canonical
 * home for that content. Keeping the homepage version short avoids the
 * duplicate-content competition between / and /now that would otherwise
 * dilute /now's standing in search results.
 *
 * Reuses .now-section wrapper + .now-link styles from NowSection so the
 * visual treatment stays consistent. When the snapshot here drifts out
 * of sync with /now, update both.
 */
export function NowTeaser() {
  return (
    <section id="now" className="now-section">
      <SectionHeader title="Now" />
      <p className="now-intro">
        Consulting with Kerrsoft, helping companies integrate AI into in-house
        and customer-facing tools. Running the Waukesha Makerspace. Building an
        async correspondence-style RPG on the side. Drafting hard sci-fi horror.
      </p>
      <p className="now-footer">
        Full picture →{" "}
        <Link href="/now" className="now-link">
          /now
        </Link>
      </p>
    </section>
  );
}
