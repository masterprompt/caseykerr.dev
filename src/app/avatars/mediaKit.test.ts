import { describe, it, expect } from "vitest";

import {
  extensionOf,
  isAllowedImage,
  labelFromFilename,
  toMediaItems,
} from "./mediaKit";

describe("extensionOf", () => {
  it("returns the lowercased extension without the dot", () => {
    expect(extensionOf("headshot.PNG")).toBe("png");
    expect(extensionOf("photo.jpeg")).toBe("jpeg");
  });

  it("uses only the final extension for multi-dot names", () => {
    expect(extensionOf("casey.profile.v2.webp")).toBe("webp");
  });

  it("returns empty string for extensionless names and dotfiles", () => {
    expect(extensionOf("README")).toBe("");
    expect(extensionOf(".DS_Store")).toBe("");
  });
});

describe("isAllowedImage", () => {
  it("accepts the raster whitelist regardless of case", () => {
    for (const name of ["a.png", "b.jpg", "c.jpeg", "d.webp", "e.gif", "f.JPG"]) {
      expect(isAllowedImage(name)).toBe(true);
    }
  });

  it("excludes SVG", () => {
    expect(isAllowedImage("logo.svg")).toBe(false);
  });

  it("excludes junk, docs, and dotfiles", () => {
    expect(isAllowedImage("README.txt")).toBe(false);
    expect(isAllowedImage(".DS_Store")).toBe(false);
    expect(isAllowedImage(".gitkeep")).toBe(false);
    expect(isAllowedImage("notes")).toBe(false);
  });
});

describe("labelFromFilename", () => {
  it("title-cases and replaces separators", () => {
    expect(labelFromFilename("casey-headshot.png")).toBe("Casey Headshot");
    expect(labelFromFilename("work_avatar_2026.jpg")).toBe("Work Avatar 2026");
  });

  it("collapses repeated and mixed separators", () => {
    expect(labelFromFilename("casey--kerr__pro.webp")).toBe("Casey Kerr Pro");
  });

  it("handles a name with no extension", () => {
    expect(labelFromFilename("just-casey")).toBe("Just Casey");
  });
});

describe("toMediaItems", () => {
  it("filters to images, sorts by name, and shapes each item", () => {
    const items = toMediaItems([
      "z-last.png",
      "README.txt",
      "a-first.jpg",
      ".DS_Store",
      "logo.svg",
    ]);

    expect(items).toEqual([
      { file: "a-first.jpg", href: "/avatars/a-first.jpg", label: "A First" },
      { file: "z-last.png", href: "/avatars/z-last.png", label: "Z Last" },
    ]);
  });

  it("returns an empty array when there are no images", () => {
    expect(toMediaItems(["README.txt", ".gitkeep"])).toEqual([]);
  });
});
