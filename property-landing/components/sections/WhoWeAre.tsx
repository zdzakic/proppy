/**
 * WhoWeAreSection
 *
 * Purpose:
 * Introduces the people and philosophy behind the solution.
 *
 * Why this structure:
 * - Continues zig-zag pattern (surface background)
 * - Clean editorial layout (no cards)
 * - Premium tone through spacing and typography
 * - Mobile-first stacking
 */

export default function WhoWeAreSection() {
  return (
    <section
      id="who-we-are"
      className="bg-brand-bg text-brand-text py-24"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Label */}
        <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
          Who We Are
        </p>

        {/* Title */}
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
          Independent. Structured. Owner-Focused.
        </h2>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-16 mt-16">

          <div>
            <p className="text-lg text-brand-muted leading-relaxed">
              We are property professionals focused on improving governance
              structures and ensuring owners retain clarity and control over
              their buildings.
            </p>
          </div>

          <div>
            <p className="text-lg text-brand-muted leading-relaxed">
              Our approach is analytical, structured and independent — built
              to support Directors in making informed decisions and protecting
              long-term property value.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}