import Link from "next/link";
import type { Metadata } from "next";

import { NowSection } from "@/components/sections/NowSection";

// Standalone /now page so the route is real (not a redirect), letting
// nownownow.com and other /now-aware crawlers index the content directly.
export const metadata: Metadata = {
  title: "Now / Casey Kerr",
  description:
    "What Casey Kerr is working on right now. A /now page in the Sivers tradition.",
};

export default function NowPage() {
  return (
    <>
      <NowSection />
      <nav className="now-back-nav">
        <Link href="/">← back to caseykerr.dev</Link>
      </nav>
    </>
  );
}
