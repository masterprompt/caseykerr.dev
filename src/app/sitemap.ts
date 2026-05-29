import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://caseykerr.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/now`,
      lastModified: new Date("2026-05-27"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
