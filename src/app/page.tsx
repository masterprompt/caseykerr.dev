import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { NowSection } from "@/components/sections/NowSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { Terminal } from "@/components/terminal/Terminal";

// Sections rendered below the Terminal hero. Custom-component sections opt
// into their own renderer; the rest use the placeholder until the matching
// content slice lands (future Work).
const SECTIONS: { id: string; title: string; Component?: () => React.ReactNode }[] = [
  { id: "about", title: "About", Component: AboutSection },
  { id: "now", title: "Now", Component: NowSection },
  { id: "work", title: "Work" },
  { id: "projects", title: "Projects", Component: ProjectsSection },
  { id: "skills", title: "Skills", Component: SkillsSection },
  { id: "contact", title: "Contact", Component: ContactSection },
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
            <SectionHeader title={s.title} />
            <p>Coming soon.</p>
          </section>
        ),
      )}
    </>
  );
}
