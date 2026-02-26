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
              <li>• Rely on the Directors to represent them</li>
              <li>• May or maybe not have interest on how things work</li>
              <li>• Some are not even aware that there are Directors representing them.</li>
              <li>• They get the bill and pay.</li>
              <li>Often left with the feeling the bills are high and not sure what they are paying for.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Directors
            </h3>
            <ul className="space-y-3 text-brand-muted leading-relaxed">
              <li>• Rely on the Property Management Company to take care of things</li>
              <li>• Very often dont question what or why things are done</li>
              <li>• Attend AGMs and make decisions on advise of the Property Management Company</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-2xl mb-4">
              Management Companies
            </h3>
            <ul className="space-y-3 text-brand-muted leading-relaxed">
              <li>• The Property Management Company may prioritise financial outcomes</li>
              <li>• Service charges for administrative functions can be high</li>
              <li>• Building work may be overvalued</li>
              <li>• Quality assurance for building work may be not done or inconsistent</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}