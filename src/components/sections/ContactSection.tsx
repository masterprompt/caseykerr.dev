import { resume } from "@/lib/resume";

import { SectionHeader } from "./SectionHeader";

type Card = {
  key: string;
  label: string;
  display: string;
  href: string;
  external: boolean;
};

// Build cards from whichever meta fields the portfolio data feed exposed.
// Order is fixed; missing fields just drop out.
function buildCards(): Card[] {
  const cards: Card[] = [];
  const { email, linkedin, github, twitter } = resume.meta;

  if (email) {
    cards.push({
      key: "email",
      label: "Email",
      display: email,
      href: `mailto:${email}`,
      external: false,
    });
  }
  if (linkedin) {
    cards.push({
      key: "linkedin",
      label: "LinkedIn",
      display: linkedin,
      href: `https://${linkedin.replace(/^https?:\/\//, "")}`,
      external: true,
    });
  }
  if (github) {
    cards.push({
      key: "github",
      label: "GitHub",
      display: github,
      href: `https://${github.replace(/^https?:\/\//, "")}`,
      external: true,
    });
  }
  if (twitter) {
    const handle = twitter.replace(/^@/, "");
    cards.push({
      key: "twitter",
      label: "Twitter / X",
      display: twitter,
      href: `https://twitter.com/${handle}`,
      external: true,
    });
  }
  return cards;
}

export function ContactSection() {
  const cards = buildCards();

  return (
    <section id="contact" className="contact-section">
      <SectionHeader title="Contact" />
      <div className="contact-grid">
        {cards.map((c) => (
          <a
            key={c.key}
            href={c.href}
            {...(c.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="contact-card"
          >
            <div className="contact-card-key">{c.label}</div>
            <div className="contact-card-value">{c.display}</div>
          </a>
        ))}
      </div>
      <p className="contact-note">
        Want the resume? Email me and I&apos;ll send the variant that best
        fits the role.
      </p>
    </section>
  );
}
