/**
 * Typed loader for casey-kerr-portfolio.json, the structured data feed
 * synced from resumatic (see docs/adr/0002). The file is produced by the
 * `portfolio` variant: in the resumatic repo, run `npm run build:portfolio`
 * and copy `output/portfolio/casey-kerr-portfolio.json` into this repo's
 * `content/` directory.
 *
 * Validation is intentionally light — minimum-required-shape check that
 * fails the build with an actionable message if the JSON is missing,
 * malformed, or shape-shifted in a breaking way.
 */

import rawData from "../../content/casey-kerr-portfolio.json";

// ── Types ───────────────────────────────────────────────────────────────

export type SkillCategory =
  | "frontend"
  | "backend"
  | "devops"
  | "databases"
  | "testing"
  | "leadership"
  | "mobile"
  | "gamedev"
  | "hardware"
  | "tools"
  | "ai"
  | "early"
  | (string & {}); // accept new categories without widening to plain string

export type Skill = {
  id: string;
  label: string;
  category: SkillCategory;
  tags?: string[];
};

export type ResumeMeta = {
  name: string;
  email?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
};

export type Bullet = {
  id?: string;
  text: string;
  tags?: string[];
};

export type ExperienceEntry = {
  id: string;
  company: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  tags?: string[];
  bullets?: Bullet[];
};

export type MediaItem = {
  type: "demo" | "youtube" | "repo" | (string & {});
  url: string;
  caption?: string;
  /**
   * Set "private" for media URLs that aren't publicly accessible (private
   * repos, draft demos, etc.). The portfolio filters these out and won't
   * link them. Omitting the field means public/visible.
   */
  visibility?: "public" | "private" | (string & {});
};

export type ProjectStatus =
  | "shipped"
  | "active"
  | "archived"
  | "scaffold"
  | (string & {});

export type ProjectEntry = {
  id: string;
  name: string;
  codename?: string;
  status?: ProjectStatus;
  tier?: string | number;
  start?: string;
  end?: string;
  url?: string;
  description?: string;
  summary?: string;
  bullets?: { id?: string; text: string; tags?: string[] }[];
  /** Skill IDs that reference Resume.skills (resolved to labels at render time). */
  skills?: string[];
  /** Free-form specific tech names (e.g. "Gemini 2.5 Flash", "AWS Cognito"). */
  tech?: string[];
  /** Category-level tags (e.g. ["ai", "backend", "core"]). */
  tags?: string[];
  media?: MediaItem[];
};

// Education / certifications / ai_highlights aren't rendered yet;
// kept loose until a section actually consumes them.
export type Resume = {
  meta: ResumeMeta;
  variant?: { id: string; label: string };
  headline?: string;
  summary?: string;
  skills: Skill[];
  experience: ExperienceEntry[];
  projects?: ProjectEntry[];
  education?: unknown[];
  certifications?: unknown[];
  ai_highlights?: unknown[];
};

// ── Validation ──────────────────────────────────────────────────────────

function validateResume(data: unknown): asserts data is Resume {
  if (!data || typeof data !== "object") {
    throw new Error(
      "casey-kerr-portfolio.json is missing or empty. In the resumatic repo, run `npm run build:portfolio` and copy output/portfolio/casey-kerr-portfolio.json to this repo's content/ directory.",
    );
  }
  const r = data as Record<string, unknown>;
  if (!r.meta || typeof r.meta !== "object") {
    throw new Error("casey-kerr-portfolio.json: `meta` is missing or invalid.");
  }
  if (!Array.isArray(r.skills)) {
    throw new Error("casey-kerr-portfolio.json: `skills` must be an array.");
  }
  if (!Array.isArray(r.experience)) {
    throw new Error("casey-kerr-portfolio.json: `experience` must be an array.");
  }
}

const data = rawData as unknown;
validateResume(data);

export const resume: Resume = data;
