export default function Hero() {
  return (
    <section className="
      relative 
      pt-24 md:pt-0
      min-h-[70vh] 
      md:min-h-[80vh] 
      md:flex 
      md:items-center
    ">
      <div className="max-w-6xl mx-auto px-6 w-full">

        <div className="max-w-xl text-white mt-20">

          <h1 className="
            font-display
            font-semibold
            text-brand-hero
            text-[2.6rem]
            md:text-[3.9rem]
            leading-[1.0]
            tracking-[-0.025em]
            mb-6
            hero-title-shadow
          ">
            Rethinking Property Management 
            <br />
            for Residential Blocks
            <br />
            {/* <span className="opacity-80">the UK</span> */}
          </h1>

          <p className="
            text-white/80
            text-[1.05rem]
            md:text-[1.125rem]
            leading-[1.65]
            tracking-[0.015em]
            mb-10
            max-w-[34rem]
          ">
            Many flat owners lack visibility into how their buildings are managed. 
            Greater transparency, collaboration, and oversight can significantly 
            improve outcomes and reduce unnecessary costs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">

            <button className="
              px-6 py-3 
              rounded-full 
              bg-brand-accent 
              text-brand-primary 
              font-medium 
              shadow-md 
              hover:opacity-95 
              transition
            ">
              Learn More
            </button>

            <button className="
              px-6 py-3 
              rounded-full 
              border border-white/40 
              text-white 
              hover:bg-white/10 
              transition
            ">
              Get Involved
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}