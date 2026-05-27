import { Terminal } from "@/components/terminal/Terminal";

// Placeholder Sections per CONTEXT.md. Narrative content lands in #07/#08.
const SECTIONS = [
  { id: "about", title: "About" },
  { id: "now", title: "Now" },
  { id: "work", title: "Work" },
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Skills" },
  { id: "contact", title: "Contact" },
];

export default function Home() {
  return (
    <>
      <Terminal />
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="placeholder-section">
          <h2>{s.title}</h2>
          <p>Coming soon.</p>
        </section>
      ))}
    </>
  );
}
