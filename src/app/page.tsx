import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { NowTeaser } from "@/components/sections/NowTeaser";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { Terminal } from "@/components/terminal/Terminal";

// Sections rendered below the Terminal hero. Custom-component sections opt
// into their own renderer; the rest use the placeholder until the matching
// content slice lands.
//
// The homepage Now slot uses NowTeaser (short snapshot + link to /now),
// not the full NowSection — /now is the canonical home for that content,
// and duplicating it on / would split search authority between the two.
const SECTIONS: { id: string; title: string; Component?: () => React.ReactNode }[] = [
  { id: "about", title: "About", Component: AboutSection },
  { id: "now", title: "Now", Component: NowTeaser },
  { id: "work", title: "Work", Component: WorkSection },
  { id: "projects", title: "Projects", Component: ProjectsSection },
  { id: "skills", title: "Skills", Component: SkillsSection },
  { id: "contact", title: "Contact", Component: ContactSection },
];

export default function Home() {
  return (
    <>
      {/* Visually-hidden page H1. The terminal hero is the visual headline,
          but crawlers and screen readers need a real <h1>; without one, the
          page jumps straight to <h2>s for About / Now / Work / etc. */}
      <h1 className="sr-only">
        Casey Kerr · Senior Full-Stack &amp; AI Engineer · Kerrsoft
      </h1>
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
