/**
 * BetterApproachSection
 *
 * Purpose:
 * Introduces a structured, transparent alternative model.
 *
 * Why this structure:
 * - Follows visual zig-zag pattern (white background)
 * - Editorial layout to keep premium tone
 * - Minimal UI logic (KISS)
 * - Mobile-first grid
 */

export default function BetterApproachSection() {
  return (
    <section
      id="better-approach"
      className="bg-brand-bg text-brand-text py-24"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Label */}
        <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
          Better Approach
        </p>

        {/* Title */}
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
          A Transparent & Structured Alternative
        </h2>

        {/* Intro */}
        <p className="max-w-3xl text-lg text-brand-muted leading-relaxed mb-20">
          A modern governance model should combine clarity, financial
          transparency and structured oversight — without adding unnecessary
          operational burden.
        </p>

        {/* 3 Pillars */}
        <div className="grid md:grid-cols-3 gap-16">

          <div>
            <h3 className="font-display text-2xl mb-4">
              Transparency
            </h3>
            <p className="text-brand-muted leading-relaxed">
              Clear financial reporting, visible service contracts and
              traceable building work decisions.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Accountability
            </h3>
            <p className="text-brand-muted leading-relaxed">
              Defined roles and measurable responsibilities between Directors
              and Management Companies.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Cost Control
            </h3>
            <p className="text-brand-muted leading-relaxed">
              Structured tender processes and independent validation of
              building works and service charges.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}