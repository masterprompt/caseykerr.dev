import Link from "next/link";
import type { Metadata } from "next";

import { NowSection } from "@/components/sections/NowSection";

const NOW_DESCRIPTION =
  "What Casey Kerr is working on right now: Kerrsoft consulting, Waukesha Makerspace, DSHA app suite, an async correspondence-style RPG, and AI side projects. A /now page in the Derek Sivers tradition.";

// Standalone /now page so the route is real (not a redirect), letting
// nownownow.com and other /now-aware crawlers index the content directly.
// This route is the canonical home for the Now content; the homepage's
// embedded Now block links here.
export const metadata: Metadata = {
  title: "Now",
  description: NOW_DESCRIPTION,
  alternates: { canonical: "/now" },
  openGraph: {
    type: "article",
    url: "/now",
    title: "Now · Casey Kerr",
    description: NOW_DESCRIPTION,
    siteName: "caseykerr.dev",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CRT terminal screen showing: $ whoami / Casey Kerr / Senior Full-Stack & AI Engineer / Founder, Kerrsoft",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Now · Casey Kerr",
    description: NOW_DESCRIPTION,
    creator: "@Casey_Kerr",
    images: ["/og-image.png"],
  },
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
