/**
 * Typed loader for the sanitized resume.json synced from resumatic
 * (see docs/adr/0002). Run `npm run sync:portfolio` in the resumatic
 * repo to refresh `content/resume.json`.
 *
 * Validation is intentionally light — minimum-required-shape check that
 * fails the build with an actionable message if the JSON is missing,
 * malformed, or shape-shifted in a breaking way. Full schema rigor (zod
 * et al.) is deferred until a downstream consumer (#06 grounding, future
 * Experience section) actually needs it.
 */

import rawData from "../../content/resume.json";

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
  email: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export type Bullet = {
  id: string;
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
   * Set false for media URLs that aren't publicly accessible (private repos,
   * draft demos, etc.). The portfolio filters these out and won't link them.
   * Defaults to true (omitting the flag = visible).
   */
  public?: boolean;
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
  public?: boolean;
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
  headline_default?: string;
  summary_default?: string;
  skills: Skill[];
  experience: ExperienceEntry[];
  projects?: ProjectEntry[];
  education?: unknown[];
  certifications?: unknown[];
  ai_highlights?: unknown[];
  _sync?: {
    sourceFile: string;
    sourceRepo: string;
    generatedAt: string;
    generatedBy: string;
    sanitization: string[];
  };
};

// ── Validation ──────────────────────────────────────────────────────────

function validateResume(data: unknown): asserts data is Resume {
  if (!data || typeof data !== "object") {
    throw new Error(
      "resume.json is missing or empty. Run `npm run sync:portfolio` in the resumatic repo to regenerate it.",
    );
  }
  const r = data as Record<string, unknown>;
  if (!r.meta || typeof r.meta !== "object") {
    throw new Error("resume.json: `meta` is missing or invalid.");
  }
  if (!Array.isArray(r.skills)) {
    throw new Error("resume.json: `skills` must be an array.");
  }
  if (!Array.isArray(r.experience)) {
    throw new Error("resume.json: `experience` must be an array.");
  }
}

const data = rawData as unknown;
validateResume(data);

export const resume: Resume = data;
