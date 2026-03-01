/**
 * WhoWeAreSection
 *
 * Refined editorial layout with:
 * - Reduced text width for better readability
 * - Subtle vertical accent line
 * - Highlighted key outcome statement
 * - Maintains premium minimal aesthetic
 */

export default function WhoWeAreSection() {
  return (
    <section
      id="who-we-are"
      className="bg-brand-surface text-brand-text py-28"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Label */}
        <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
          Who We Are
        </p>

        {/* Title */}
        <h2 className="font-display text-4xl md:text-5xl mb-12 leading-tight">
          From Leaseholders to Structured Self-Management
        </h2>

        {/* Lead Paragraph */}
        <p className="text-xl text-brand-text leading-relaxed mb-14 max-w-4xl">
          We are leaseholders who collectively chose to take responsibility
          for managing our own building.
        </p>

        {/* Editorial Content Wrapper */}
        <div className="relative max-w-4xl pl-8">

          {/* Vertical Accent Line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-brand-border"></div>

          <div className="space-y-10 text-lg text-brand-muted leading-relaxed">

            <p>
              At the point of handover, the property was in poor condition.
              Despite years of substantial service charges, standards had declined
              and confidence among owners had eroded. While the managing agent
              carried much of the responsibility, limited transparency and minimal
              owner involvement also contributed to the situation.
            </p>

            <p>
              Across the UK, many buildings have transitioned to Resident
              Management Company (RMC) structures for similar reasons. By taking
              a structured approach — reviewing accounts, ensuring health and
              safety compliance, and resetting key obligations at the start of the
              fiscal year — the transition proved more straightforward than expected.
            </p>

            <p>
              One significant advantage was having a fellow leaseholder who is a
              professional builder. Works were properly specified, competitively
              tendered, and independently validated. The result was improved
              workmanship, clearer cost control, and renewed confidence.
            </p>

            {/* Pull Highlight */}
            <div className="border-l-4 border-brand-accent pl-6">
              <p className="text-xl text-brand-text font-medium">
                It was also considerably cheaper.
              </p>
            </div>

            <p>
              We recognised the need for ongoing transparency — allowing owners
              to see, at any time, the costs incurred, works completed, and the
              financial position of the building at a glance.
            </p>

            <p className="font-medium text-brand-text">
              That commitment to openness and accountability is what ultimately
              brought us here.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}

    // export default function WhoWeAreSection() {
    // return (
    //     <section
    //     id="who-we-are"
    //     className="bg-brand-surface text-brand-text py-28"
    //     >
    //     <div className="max-w-6xl mx-auto px-6">

    //         {/* Section Label */}
    //         <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
    //         Who We Are
    //         </p>

    //         {/* Title */}
    //         <h2 className="font-display text-4xl md:text-5xl mb-12 leading-tight">
    //         From Leaseholders to Structured Self-Management
    //         </h2>

    //         {/* Lead Paragraph */}
    //         <p className="text-xl text-brand-text leading-relaxed mb-10">
    //         We are leaseholders who collectively chose to take responsibility
    //         for managing our own building.
    //         </p>

    //         {/* Body Content */}
    //         <div className="space-y-8 text-lg text-brand-muted leading-relaxed">

    //         <p>
    //             At the point of handover, the property was in poor condition.
    //             Despite years of substantial service charges, standards had declined
    //             and confidence among owners had eroded. While the managing agent
    //             carried much of the responsibility, limited transparency and minimal
    //             owner involvement also contributed to the situation.
    //         </p>

    //         <p>
    //             Across the UK, many buildings have transitioned to Resident
    //             Management Company (RMC) structures for similar reasons. By taking
    //             a structured approach — reviewing accounts, ensuring health and
    //             safety compliance, and resetting key obligations at the start of the
    //             fiscal year — the transition proved more straightforward than expected.
    //         </p>

    //         <p>
    //             One significant advantage was having a fellow leaseholder who is a
    //             professional builder. Works were properly specified, competitively
    //             tendered, and independently validated. The result was improved
    //             workmanship, clearer cost control, and renewed confidence.
    //         </p>

    //         <p className="text-brand-text font-medium">
    //             It was also considerably cheaper.
    //         </p>

    //         <p>
    //             We recognised the need for ongoing transparency — allowing owners
    //             to see, at any time, the costs incurred, works completed, and the
    //             financial position of the building at a glance.
    //         </p>

    //         <p className="font-medium text-brand-text">
    //             That commitment to openness and accountability is what ultimately
    //             brought us here.
    //         </p>

    //         </div>
    //     </div>
    //     </section>
    // );
    // }
