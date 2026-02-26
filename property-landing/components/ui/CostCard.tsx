/**
 * CostCard
 *
 * Purpose:
 * Reusable pricing / comparison card used in Cost Example section.
 *
 * Supports:
 * - light variant (default)
 * - highlight variant (primary emphasis)
 * - optional savingsNote displayed inline with value (light only)
 *
 * Design goals:
 * - Clean consulting-style layout
 * - Strong visual hierarchy
 * - Subtle premium feel without overdesign
 */

type CostCardProps = {
  label: string
  value: string
  description: string
  variant?: "light" | "highlight"
  savingsNote?: string
}

export default function CostCard({
  label,
  value,
  description,
  variant = "light",
  savingsNote,
}: CostCardProps) {

  const isHighlight = variant === "highlight"

  return (
    <div
      className={`
        relative p-10 rounded-2xl transition-all duration-300
        ${isHighlight
          ? "bg-brand-primary text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/10"
          : "bg-white shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-black/5"
        }
        hover:scale-[1.02]
      `}
    >
      {/* Soft ambient glow for highlight variant */}
      {isHighlight && (
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-accent/10 blur-3xl rounded-full" />
      )}

      <div className="relative z-10">

        {/* Label */}
        <div
          className={`text-sm uppercase tracking-wider mb-6 ${
            isHighlight ? "text-brand-accent-light" : "text-brand-accent"
          }`}
        >
          {label}
        </div>

        {/* Value row (value + savings inline for light card) */}
        <div className="flex items-end justify-between mb-6">
          <div
            className={`font-display ${
              isHighlight
                ? "text-6xl"
                : "text-5xl text-brand-primary"
            }`}
          >
            {value}
          </div>

          {!isHighlight && savingsNote && (
            <div className="text-sm text-brand-accent font-medium whitespace-nowrap">
              {savingsNote}
            </div>
          )}
        </div>

        {/* Description */}
        <p
          className={`leading-relaxed ${
            isHighlight ? "text-white/80" : "text-brand-text/70"
          }`}
        >
          {description}
        </p>

      </div>
    </div>
  )
}

// type CostCardProps = {
//   label: string
//   value: string
//   description: string
//   variant?: "light" | "highlight"
//   savingsNote?: string
// }

// export default function CostCard({
//   label,
//   value,
//   description,
//   variant = "light",
//   savingsNote,
// }: CostCardProps) {

//   const isHighlight = variant === "highlight"

//   return (
//     <div
//       className={`
//         relative p-10 rounded-2xl transition-all duration-300
//         ${isHighlight
//           ? "bg-brand-primary text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/10"
//           : "bg-white shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-black/5"
//         }
//         hover:scale-[1.02]
//       `}
//     >
//       {isHighlight && (
//         <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-accent/10 blur-3xl rounded-full" />
//       )}

//       <div className="relative z-10">
//         <div className={`text-sm uppercase tracking-wider mb-4 ${
//           isHighlight ? "text-brand-accent-light" : "text-brand-accent"
//         }`}>
//           {label}
//         </div>

//         <div className={`font-display mb-4 ${
//           isHighlight ? "text-6xl" : "text-5xl text-brand-primary"
//         }`}>
//           {value}
//         </div>

//         {/* Savings note only for light card */}
//         {!isHighlight && savingsNote && (
//           <div className="text-sm text-brand-accent mt-1 mb-4">
//             {savingsNote}
//           </div>
//         )}

//         <p className={isHighlight ? "text-white/80" : "text-brand-text/70"}>
//           {description}
//         </p>
//       </div>
//     </div>
//   )
// }