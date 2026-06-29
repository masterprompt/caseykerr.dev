import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

import { toMediaItems } from "./mediaKit";

// Unlisted utility page. Not linked from nav/footer, not in sitemap.ts.
// noindex keeps it out of search; the contents are public-safe, so this is
// tidiness rather than security.
export const metadata: Metadata = {
  title: "Casey's Media Kit",
  robots: { index: false, follow: false },
};

// Resolved at build time (static export). Drop a raster file into
// public/avatars/, commit, and the next build renders a tile for it.
const AVATARS_DIR = path.join(process.cwd(), "public", "avatars");

function readAvatarFiles(): string[] {
  try {
    return fs.readdirSync(AVATARS_DIR);
  } catch {
    return [];
  }
}

export default function MediaKitPage() {
  const items = toMediaItems(readAvatarFiles());

  return (
    <main className="min-h-screen bg-[var(--terminal-bg)] px-6 py-12 text-[var(--terminal-fg)] sm:px-10">
      <header className="mb-10">
        <h1
          className="font-mono text-3xl font-bold sm:text-4xl"
          style={{ textShadow: "var(--terminal-bloom)" }}
        >
          Casey&apos;s Media Kit
        </h1>
        <p className="mt-2 font-mono text-sm text-[var(--terminal-accent)]">
          Headshots, logos, and avatars. Click an image to download, or
          right-click and save.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="font-mono text-sm opacity-70">
          No media yet. Add raster images to{" "}
          <code className="text-[var(--terminal-accent)]">public/avatars/</code>{" "}
          and rebuild.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <li
              key={item.file}
              className="flex flex-col rounded-md border border-[var(--terminal-fg)]/30 bg-black/30 p-3"
            >
              <a
                href={item.href}
                download={item.file}
                className="block overflow-hidden rounded bg-black/40"
                title={`Download ${item.file}`}
              >
                {/* Plain <img>: images.unoptimized is on and we want the exact
                    original bytes delivered for re-upload, so next/image buys
                    us nothing here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.href}
                  alt={item.label}
                  className="aspect-square w-full object-contain"
                />
              </a>
              <div className="mt-2 flex flex-col gap-1">
                <span className="truncate font-mono text-xs" title={item.label}>
                  {item.label}
                </span>
                <a
                  href={item.href}
                  download={item.file}
                  className="font-mono text-xs text-[var(--terminal-accent)] underline underline-offset-2 hover:opacity-80"
                >
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
