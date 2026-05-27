import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { Terminal } from "@/components/terminal/Terminal";

// Sections rendered below the Terminal hero. Custom-component sections opt
// into their own renderer; the rest use the placeholder until the matching
// content slice lands (#07 Now, #08 Projects+Contact).
const SECTIONS: { id: string; title: string; Component?: () => React.ReactNode }[] = [
  { id: "about", title: "About", Component: AboutSection },
  { id: "now", title: "Now" },
  { id: "work", title: "Work" },
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Skills", Component: SkillsSection },
  { id: "contact", title: "Contact" },
];

export default function Home() {
  return (
    <>
      <Terminal />
      {SECTIONS.map((s) =>
        s.Component ? (
          <s.Component key={s.id} />
        ) : (
          <section key={s.id} id={s.id} className="placeholder-section">
            <h2>{s.title}</h2>
            <p>Coming soon.</p>
          </section>
        ),
      )}
    </>
  );
}
