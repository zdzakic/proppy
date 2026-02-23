export default function ChallengesSection() {
  return (
    <section
      id="challenges"
      className="bg-brand-surface text-brand-text py-24"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Label */}
        <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
          Challenges
        </p>

        {/* Title */}
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
          Where the Structure Often Breaks Down
        </h2>

        {/* Intro */}
        <p className="max-w-3xl text-lg text-brand-muted leading-relaxed mb-16">
          While the governance model appears sound on paper, practical
          challenges often emerge due to limited transparency, passive
          oversight, and misaligned incentives.
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-12">

          <div>
            <h3 className="font-display text-2xl mb-4">
              Owners
            </h3>
            <ul className="space-y-3 text-brand-muted leading-relaxed">
              <li>• Limited visibility into operational decisions</li>
              <li>• Often unaware of cost breakdowns</li>
              <li>• Minimal participation in governance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Directors
            </h3>
            <ul className="space-y-3 text-brand-muted leading-relaxed">
              <li>• Heavy reliance on management advice</li>
              <li>• Limited technical validation of works</li>
              <li>• Constrained time and resources</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Management Companies
            </h3>
            <ul className="space-y-3 text-brand-muted leading-relaxed">
              <li>• Commercial incentive structures</li>
              <li>• Process-driven rather than outcome-driven</li>
              <li>• Administrative complexity over clarity</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}