export default function OverviewSection() {
  return (
    <section
      id="overview"
      className="bg-brand-bg text-brand-text py-24"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Label */}
        <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
          Overview
        </p>

        {/* Section Title */}
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
          How Property Management Typically Works
        </h2>

        {/* Intro */}
        <p className="max-w-3xl text-lg text-brand-muted leading-relaxed mb-16">
          Residential blocks are commonly structured as independent companies,
          where each flat owner holds a share and volunteer Directors oversee
          operations through an appointed Property Management Company.
        </p>

        {/* 3 Columns */}
        <div className="grid md:grid-cols-3 gap-12">

          <div>
            <h3 className="font-display text-2xl mb-4">
              Owners
            </h3>
            <p className="text-brand-muted leading-relaxed">
              Each owner holds a share in the company and relies on
              appointed Directors to represent their interests.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Directors
            </h3>
            <p className="text-brand-muted leading-relaxed">
              Volunteer owners responsible for liaising with the
              Property Management Company and making key decisions.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Management Company
            </h3>
            <p className="text-brand-muted leading-relaxed">
              A commercial entity appointed to manage operations,
              administration, and contractor coordination.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}