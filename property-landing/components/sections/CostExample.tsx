/**
 * CostExampleSection
 *
 * Purpose:
 * Demonstrates real-world financial comparison between
 * self-managed and management company scenarios.
 *
 * Design goals:
 * - Clear narrative progression
 * - Strong contrast between options
 * - Maintain premium minimal aesthetic
 */

import CostCard from "@/components/ui/CostCard"

export default function CostExampleSection() {
  return (
    <section id="cost-example" className="py-24 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section Label */}
        <div className="text-brand-accent uppercase tracking-[0.2em] text-sm mb-6">
          Cost Example
        </div>

        {/* Section Title */}
        <h2 className="font-display text-4xl md:text-5xl text-brand-primary mb-8">
          A Real-World Cost Comparison
        </h2>

        {/* Section Intro */}
        <p className="max-w-3xl text-lg text-brand-text/80 leading-relaxed mb-16">
          After transitioning to self-management, a project originally quoted
          significantly higher was completed at a much lower cost — without
          compromising quality.
        </p>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-12">

          <CostCard
            label="Self-Managed"
            value="£97K"
            savingsNote="£113K–£193K saved"
            description="Independent quote obtained after taking control of the project."
          />

          <CostCard
            label="Via Management Company"
            value="£210K – £290K"
            description="Quotes sourced through standard management processes."
            variant="highlight"
          />

        </div>

      </div>
    </section>
  )
}
// import CostCard from "@/components/ui/CostCard"

// export default function CostExampleSection() {
//   return (
//     <section id="cost-example" className="py-28 bg-brand-bg">
//       <div className="max-w-6xl mx-auto px-6">

//         {/* Section Label */}
//         <div className="text-brand-accent uppercase tracking-[0.2em] text-sm mb-6">
//           Cost Example
//         </div>

//         {/* Section Title */}
//         <h2 className="font-display text-4xl md:text-5xl text-brand-primary mb-8">
//           A Real-World Cost Comparison
//         </h2>

//         {/* Section Intro */}
//         <p className="max-w-3xl text-lg text-brand-text/80 mb-20 leading-relaxed">
//           After transitioning to self-management, a project originally quoted
//           significantly higher was completed at a much lower cost — without
//           compromising quality.
//         </p>

//         {/* Cards */}
//         <div className="grid md:grid-cols-2 gap-16 relative">

//           <CostCard
//             label="Self-Managed"
//             value="£97K"
//             savingsNote="Saved approximately £113K–£193K"
//             description="Independent quote obtained after taking control of the project."
//           />

//           <CostCard
//             label="Via Management Company"
//             value="£210K – £290K"
//             description="Quotes sourced through standard management processes."
//             variant="highlight"
//           />

//         </div>

//       </div>
//     </section>
//   )
// }