// Pure logic for Casey's Media Kit (/avatars).
//
// The build-time filesystem read lives in page.tsx. Everything here is the part
// that could actually be *wrong* - which files count as avatars, and how a
// filename becomes a display label - so it can be unit-tested without touching
// the filesystem or rendering.

// Raster formats only. SVG is intentionally excluded: these images are destined
// for Teams/Jira/etc. (which want raster uploads), and skipping SVG sidesteps
// the inline-script footgun on a page loaded from locked-down work machines.
export const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif"] as const;

/** Lowercased extension without the dot, or "" for dotfiles / extensionless names. */
export function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  // dot <= 0 covers both "no dot" and a leading-dot dotfile like ".DS_Store".
  if (dot <= 0) return "";
  return filename.slice(dot + 1).toLowerCase();
}

/** True for the raster image files we display; junk and dotfiles fall away. */
export function isAllowedImage(filename: string): boolean {
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(extensionOf(filename));
}

/** "casey-headshot.png" -> "Casey Headshot" */
export function labelFromFilename(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  return stem
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .filter(Boolean)
    .join(" ");
}

export interface MediaItem {
  /** Filename within public/avatars. */
  file: string;
  /** Public URL path the browser downloads from. */
  href: string;
  /** Human label shown under the image. */
  label: string;
}

/**
 * Filter a raw directory listing down to displayable images, sort them
 * stably by name, and shape each for rendering. Pure: takes the raw names.
 */
export function toMediaItems(filenames: string[]): MediaItem[] {
  return filenames
    .filter(isAllowedImage)
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({
      file,
      href: `/avatars/${file}`,
      label: labelFromFilename(file),
    }));
}
