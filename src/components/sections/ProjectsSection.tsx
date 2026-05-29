import featuredIds from "../../../content/featured-projects.json";
import { resume, type MediaItem, type ProjectEntry } from "@/lib/resume";

import { SectionHeader } from "./SectionHeader";

/**
 * ProjectsSection
 *
 * Curation is explicit: `content/featured-projects.json` is a flat array of
 * project IDs in display order. Edit it to feature/unfeature projects or to
 * reorder them. Anything not in that list does not render here.
 *
 * Safety nets layered on top of the explicit list:
 *   1. HIDDEN_PROJECT_IDS — names we never publish (pre-launch products)
 *      stay hidden even if listed in featured-projects.json by accident.
 *   2. Public-media check — a featured project with no publicly-visible
 *      media items (i.e. nothing marked `visibility: "private"` in the
 *      portfolio data feed) is skipped, so a card never renders with
 *      zero clickable links.
 *
 * Build-time `console.warn` flags IDs that aren't found in the data feed,
 * which usually means a typo or a stale ID.
 */

// Per `feedback-no-unreleased-project-names`: never name these on the
// publicly-indexed portfolio, even if they end up in featured-projects.json.
const HIDDEN_PROJECT_IDS = new Set<string>([
  "parallax_rpg",
  "the_chronoverse",
]);

// Skill ID → display label, built once from the resume's skills array.
const SKILL_LABEL_BY_ID = new Map(
  resume.skills.map((s) => [s.id, s.label]),
);

const PROJECT_BY_ID = new Map(
  (resume.projects ?? []).map((p) => [p.id, p]),
);

function splitName(fullName: string): { name: string; description: string } {
  const dashIdx = fullName.indexOf("—");
  if (dashIdx === -1) return { name: fullName.trim(), description: "" };
  return {
    name: fullName.slice(0, dashIdx).trim(),
    description: fullName.slice(dashIdx + 1).trim(),
  };
}

function isPublicMedia(m: MediaItem): boolean {
  return (
    typeof m.url === "string" && m.url.length > 0 && m.visibility !== "private"
  );
}

function hasAnyPublicMedia(p: ProjectEntry): boolean {
  if (!Array.isArray(p.media)) return false;
  return p.media.some(isPublicMedia);
}

function resolveOrderedProjects(): ProjectEntry[] {
  const out: ProjectEntry[] = [];
  for (const id of featuredIds as string[]) {
    if (HIDDEN_PROJECT_IDS.has(id)) continue;
    const p = PROJECT_BY_ID.get(id);
    if (!p) {
      console.warn(
        `featured-projects.json: unknown project id "${id}" (not present in casey-kerr-portfolio.json)`,
      );
      continue;
    }
    if (!hasAnyPublicMedia(p)) {
      console.warn(
        `featured-projects.json: "${id}" has no public media; skipping`,
      );
      continue;
    }
    out.push(p);
  }
  return out;
}

function defaultLabel(type: string): string {
  if (type === "demo") return "Live demo";
  if (type === "youtube") return "Video";
  if (type === "repo") return "Source code";
  return type;
}

function buildLinkLabels(media: MediaItem[]): string[] {
  const baseLabels = media.map(
    (m) => m.caption?.trim() || defaultLabel(m.type),
  );
  const totals = new Map<string, number>();
  for (const label of baseLabels) {
    totals.set(label, (totals.get(label) ?? 0) + 1);
  }
  const seen = new Map<string, number>();
  return baseLabels.map((label) => {
    const total = totals.get(label) ?? 0;
    if (total <= 1) return label;
    const n = (seen.get(label) ?? 0) + 1;
    seen.set(label, n);
    return `${label} ${n}`;
  });
}

function resolveSkillLabels(skillIds: string[] | undefined): string[] {
  if (!skillIds) return [];
  return skillIds
    .map((id) => SKILL_LABEL_BY_ID.get(id))
    .filter((label): label is string => typeof label === "string");
}

export function ProjectsSection() {
  const featured = resolveOrderedProjects();

  return (
    <section id="projects" className="projects-section">
      <SectionHeader title="Projects" />
      <div className="projects-grid">
        {featured.map((p) => {
          const { name, description } = splitName(p.name);
          const visibleMedia = (p.media ?? []).filter(isPublicMedia);
          const linkLabels = buildLinkLabels(visibleMedia);
          const skillLabels = resolveSkillLabels(p.skills);
          const techLabels = p.tech ?? [];

          return (
            <details key={p.id} className="project-card">
              <summary className="project-card-toggle">
                <span className="project-card-caret" aria-hidden>
                  ▸
                </span>
                <span className="project-card-text">
                  <span className="project-card-name">{name}</span>
                  {description && (
                    <span className="project-card-description">
                      {description}
                    </span>
                  )}
                </span>
              </summary>
              <div className="project-card-details">
                {skillLabels.length > 0 && (
                  <div className="project-card-section">
                    <div className="project-card-section-label">skills</div>
                    <div className="project-card-tags">
                      {skillLabels.map((label) => (
                        <span key={label} className="project-card-tag">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {techLabels.length > 0 && (
                  <div className="project-card-section">
                    <div className="project-card-section-label">tech</div>
                    <div className="project-card-tags">
                      {techLabels.map((label) => (
                        <span key={label} className="project-card-tag">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {visibleMedia.length > 0 && (
                  <div className="project-card-section">
                    <div className="project-card-section-label">links</div>
                    <ul className="project-card-links">
                      {visibleMedia.map((m, i) => (
                        <li key={m.url}>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card-link"
                          >
                            {linkLabels[i]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
