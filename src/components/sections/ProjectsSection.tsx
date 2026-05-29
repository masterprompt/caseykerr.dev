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
 * Private media (`visibility: "private"`) is filtered out at render time:
 * the project card still renders (with name, description, skills, tech),
 * but the "links" section is suppressed if no public media remains. A card
 * with zero clickable links is fine — skills and tech still tell the story.
 *
 * Build-time `console.warn` flags IDs that aren't found in the data feed,
 * which usually means a typo or a stale ID.
 */

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

function resolveOrderedProjects(): ProjectEntry[] {
  const out: ProjectEntry[] = [];
  for (const id of featuredIds as string[]) {
    const p = PROJECT_BY_ID.get(id);
    if (!p) {
      console.warn(
        `featured-projects.json: unknown project id "${id}" (not present in casey-kerr-portfolio.json)`,
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
          // Combine resolved master-skill labels with free-form tech entries
          // into a single list, preserving order and dropping duplicates.
          const skillLabels = Array.from(
            new Set([
              ...resolveSkillLabels(p.skills),
              ...(p.tech ?? []),
            ]),
          );

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
                {p.summary && (
                  <p className="project-card-summary">{p.summary.trim()}</p>
                )}
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
