import featuredWork from "../../../content/featured-work.json";
import { resume, type ExperienceEntry } from "@/lib/resume";

import { SectionHeader } from "./SectionHeader";

/**
 * WorkSection
 *
 * Scannable "selected work" panel — company + role only, no dates, grouped
 * by recency. Companion to About (narrative arc), Now (what's current), and
 * Projects (actual builds). Anyone who needs the full chronological CV has
 * LinkedIn.
 *
 * Curation lives in `content/featured-work.json` — a list of groups, each
 * with a label and an ordered array of experience IDs. Edit that file to
 * add, remove, reorder, or relabel anything in this section.
 *
 * Current consulting clients are NEVER named here (per feedback memory) —
 * they're covered by the Kerrsoft umbrella entry.
 */

type WorkGroup = { label: string; ids: string[] };

const WORK = featuredWork as WorkGroup[];

const EXPERIENCE_BY_ID = new Map<string, ExperienceEntry>(
  resume.experience.map((e) => [e.id, e]),
);

function resolveEntries(ids: string[]): ExperienceEntry[] {
  const out: ExperienceEntry[] = [];
  for (const id of ids) {
    const e = EXPERIENCE_BY_ID.get(id);
    if (!e) {
      console.warn(
        `featured-work.json: unknown experience id "${id}" (not present in casey-kerr-portfolio.json)`,
      );
      continue;
    }
    out.push(e);
  }
  return out;
}

export function WorkSection() {
  return (
    <section id="work" className="work-section">
      <SectionHeader title="Work" />
      <div className="work-groups">
        {WORK.map((group) => {
          const items = resolveEntries(group.ids);
          if (items.length === 0) return null;
          return (
            <div key={group.label} className="work-group">
              <h3 className="work-group-label">{group.label}</h3>
              <ul className="work-list">
                {items.map((e) => (
                  <li key={e.id} className="work-item">
                    <span className="work-item-company">{e.company}</span>
                    <span className="work-item-sep" aria-hidden>
                      {" · "}
                    </span>
                    <span className="work-item-title">{e.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
