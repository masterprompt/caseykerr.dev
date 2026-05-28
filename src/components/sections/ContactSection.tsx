import { SectionHeader } from "./SectionHeader";

export function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <SectionHeader title="Contact" />
      <div className="contact-grid">
        <a href="mailto:me@caseykerr.com" className="contact-card">
          <div className="contact-card-key">Email</div>
          <div className="contact-card-value">me@caseykerr.com</div>
        </a>
        <a
          href="https://linkedin.com/in/caseykerr"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <div className="contact-card-key">LinkedIn</div>
          <div className="contact-card-value">linkedin.com/in/caseykerr</div>
        </a>
        <a
          href="https://github.com/masterprompt"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <div className="contact-card-key">GitHub</div>
          <div className="contact-card-value">github.com/masterprompt</div>
        </a>
      </div>
      <p className="contact-note">
        Want the resume? Email me and I&apos;ll send the variant that best
        fits the role.
      </p>
    </section>
  );
}
