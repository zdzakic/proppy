export default function CostExampleSection() {
  return (
    <section id="cost-example" className="py-24 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-brand-accent uppercase tracking-[0.2em] text-sm mb-6">
          Cost Example
        </div>

        <h2 className="font-display text-4xl md:text-5xl text-brand-primary mb-8">
          A Real-World Cost Comparison
        </h2>

        <p className="max-w-3xl text-lg text-brand-text/80 mb-16">
          After transitioning to self-management, a project originally quoted
          significantly higher was completed at a much lower cost — without
          compromising quality.
        </p>

        <div className="grid md:grid-cols-2 gap-12">

          <div className="
            p-10 rounded-2xl bg-white
            shadow-[0_15px_50px_rgba(0,0,0,0.06)]
            border border-black/5
            hover:scale-[1.02]
            transition-transform duration-300
          ">
            <div className="text-sm uppercase tracking-wider text-brand-accent mb-4">
              Self-Managed
            </div>

            <div className="text-5xl font-display text-brand-primary mb-4">
              £97K
            </div>

            <p className="text-brand-text/70">
              Independent quote obtained after taking control of the project.
            </p>
          </div>

          <div className="
            p-10 rounded-2xl
            bg-gradient-to-br from-primary to-primary-dark
            text-white
            shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            border border-white/10
            hover:scale-[1.02]
            transition-transform duration-300
            relative overflow-hidden
          ">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-accent/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="text-sm uppercase tracking-wider text-brand-accent-light mb-4">
                Via Management Company
              </div>

              <div className="text-6xl font-display mb-4">
                £210K – £290K
              </div>

              <p className="text-white/80">
                Quotes sourced through standard management processes.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}