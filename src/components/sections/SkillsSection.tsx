import { resume } from "@/lib/resume";

// Canonical display order for known categories. Unknown categories (added
// to resumatic later) trail at the end in insertion order.
const CATEGORY_ORDER: string[] = [
  "frontend",
  "backend",
  "devops",
  "databases",
  "testing",
  "ai",
  "tools",
  "mobile",
  "leadership",
  "gamedev",
  "hardware",
  "early",
];

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "front-end",
  backend: "back-end",
  devops: "cloud & devops",
  databases: "databases",
  testing: "testing & qa",
  ai: "ai",
  tools: "tools",
  mobile: "mobile",
  leadership: "leadership",
  gamedev: "game dev",
  hardware: "hardware / plc",
  early: "early career",
};

export function SkillsSection() {
  const groups = new Map<string, typeof resume.skills>();
  for (const skill of resume.skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }

  const ordered = [
    ...CATEGORY_ORDER.filter((c) => groups.has(c)),
    ...Array.from(groups.keys()).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <section id="skills" className="skills-section">
      <h2>Skills</h2>
      <div className="skills-rows">
        {ordered.map((category) => (
          <div key={category} className="skills-row">
            <h3 className="skills-row-key">
              {CATEGORY_LABELS[category] ?? category}
            </h3>
            <div className="skills-row-pills">
              {groups.get(category)!.map((skill) => (
                <span key={skill.id} className="skills-pill">
                  {skill.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
