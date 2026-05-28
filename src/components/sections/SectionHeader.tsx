"use client";

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <button
        type="button"
        className="section-back-to-top"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        aria-label={`Back to top from ${title}`}
      >
        ↑ top
      </button>
    </div>
  );
}
