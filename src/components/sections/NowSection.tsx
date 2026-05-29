import { SectionHeader } from "./SectionHeader";

export function NowSection() {
  return (
    <section id="now" className="now-section">
      <SectionHeader title="Now" />
      <p className="now-meta">
        Last updated: <time dateTime="2026-05-27">2026-05-27</time>
      </p>
      <p className="now-intro">Right now I&apos;m:</p>
      <ul className="now-list">
        <li>
          <strong>
            Helping companies build AI-assisted in-house and customer-facing
            solutions
          </strong>{" "}
          through Kerrsoft, my consulting practice. The work spans portal AI
          chat, AI-accelerated feature development, and human-in-the-loop code
          review. Multiple engagements running in parallel.
        </li>
        <li>
          <strong>Helping run the Waukesha Makerspace.</strong> I serve on the
          board and act as director of the shop floor. Currently building out
          the CNC and laser areas, planning a facility expansion, and exploring
          how AI can ease day-to-day administrative burden on volunteers and
          board members.
        </li>
        <li>
          <strong>Supporting the DSHA app suite.</strong> I built the original
          student enrollment management suite for Divine Savior Holy Angels a
          few years back, and continue to maintain it. Planning and building
          the next version now, with AI assist.
        </li>
        <li>
          <strong>Building with AI on the side.</strong> The active project is
          an asynchronous, correspondence-style RPG platform, inspired by blind
          RPGs and chess-by-mail. A handful of other apps in various stages.
        </li>
        <li>
          <strong>
            Contributing to public/community code repositories
          </strong>{" "}
          when time allows. The lineup rotates; the habit doesn&apos;t.
        </li>
        <li>
          <strong>Writing science fiction.</strong> Drafting a hard sci-fi
          horror series. Currently in the worldbuilding phase, several chapters
          in.
        </li>
        <li>
          <strong>Exploring AI for personal use.</strong> Running local LLMs on
          my own hardware, plus side projects like Hermes and OpenClaw.
        </li>
        <li>
          <strong>Off the keyboard.</strong> Regular at the gym (strong body,
          strong mind), bicycling through the warmer months, and playing in
          volleyball leagues. Cooking is a kept-up love that traces back to my
          first paying jobs as a teen in kitchens; occasional sweet tooth too.
        </li>
      </ul>
      <p className="now-footer">
        This is a <code>/now</code> page in the{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="now-link"
        >
          Derek Sivers tradition
        </a>
        , a snapshot of what I&apos;d tell you if you bumped into me at a
        meetup, not a curated highlight reel.
      </p>
    </section>
  );
}
