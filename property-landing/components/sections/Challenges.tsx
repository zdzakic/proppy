/**
 * ChallengesSection
 *
 * Purpose:
 * Highlights structural weaknesses within the traditional governance model.
 *
 * Why this structure:
 * - Editorial layout (not card-based) to contrast Overview section
 * - Uses reusable ChallengeColumn + ProblemItem UI components
 * - Removes classic bullet points for cleaner premium feel
 * - Keeps mobile-first structure
 */

import ChallengeColumn from "@/components/ui/ChallengeColumn";
import { ChallengeItem } from "@/components/ui/ChallengeItem";

export default function ChallengesSection() {
  return (
    <section
      id="challenges"
      className="bg-brand-surface text-brand-text py-24"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* ========================================= */}
        {/* SECTION LABEL */}
        {/* ========================================= */}
        <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
          Challenges
        </p>

        {/* ========================================= */}
        {/* SECTION TITLE */}
        {/* ========================================= */}
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
          Where the Structure Often Breaks Down
        </h2>

        {/* ========================================= */}
        {/* INTRO TEXT */}
        {/* ========================================= */}
        <p className="max-w-3xl text-lg text-brand-muted leading-relaxed mb-20">
          While the governance model appears sound on paper, practical
          challenges often emerge due to limited transparency, passive
          oversight, and misaligned incentives.
        </p>

        {/* ========================================= */}
        {/* 3 COLUMN STRUCTURE */}
        {/* ========================================= */}
        <div className="grid md:grid-cols-3 gap-16">

          {/* ================= OWNERS ================= */}
          <ChallengeColumn title="Owners">
            <ChallengeItem text="Rely on the Directors to represent them." />
            <ChallengeItem text="May or may not take interest in how things work." />
            <ChallengeItem text="Are often unaware that Directors represent them." />
            <ChallengeItem text="Receive the bill and pay." />
            <ChallengeItem text="Often left unsure what they are paying for." />
          </ChallengeColumn>

          {/* ================= DIRECTORS ================= */}
          <ChallengeColumn title="Directors">
            <ChallengeItem text="Rely on the Property Management Company to take care of things." />
            <ChallengeItem text="Very often do not question what or why decisions are made." />
            <ChallengeItem text="Attend AGMs and make decisions based on provided advice." />
          </ChallengeColumn>

          {/* ================= MANAGEMENT COMPANIES ================= */}
          <ChallengeColumn title="Management Companies">
            <ChallengeItem text="May prioritise financial outcomes." />
            <ChallengeItem text="Administrative service charges can be high." />
            <ChallengeItem text="Building work may be overvalued." />
            <ChallengeItem text="Quality assurance for building work may be inconsistent." />
          </ChallengeColumn>

        </div>
      </div>
    </section>
  );
}
// export default function ChallengesSection() {
//   return (
//     <section
//       id="challenges"
//       className="bg-brand-surface text-brand-text py-24"
//     >
//       <div className="max-w-6xl mx-auto px-6">

//         {/* Label */}
//         <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
//           Challenges
//         </p>

//         {/* Title */}
//         <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
//           Where the Structure Often Breaks Down
//         </h2>

//         {/* Intro */}
//         <p className="max-w-3xl text-lg text-brand-muted leading-relaxed mb-16">
//           While the governance model appears sound on paper, practical
//           challenges often emerge due to limited transparency, passive
//           oversight, and misaligned incentives.
//         </p>

//         {/* Grid */}
//         <div className="grid md:grid-cols-3 gap-12">

//           <div>
//             <h3 className="font-display text-2xl mb-4">
//               Owners
//             </h3>
//             <ul className="space-y-3 text-brand-muted leading-relaxed">
//               <li>• Rely on the Directors to represent them</li>
//               <li>• May or maybe not have interest on how things work</li>
//               <li>• Some are not even aware that there are Directors representing them.</li>
//               <li>• They get the bill and pay.</li>
//               <li>Often left with the feeling the bills are high and not sure what they are paying for.</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-display text-2xl mb-4">
//               Directors
//             </h3>
//             <ul className="space-y-3 text-brand-muted leading-relaxed">
//               <li>• Rely on the Property Management Company to take care of things</li>
//               <li>• Very often dont question what or why things are done</li>
//               <li>• Attend AGMs and make decisions on advise of the Property Management Company</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-display text-2xl mb-4">
//               Management Companies
//             </h3>
//             <ul className="space-y-3 text-brand-muted leading-relaxed">
//               <li>• The Property Management Company may prioritise financial outcomes</li>
//               <li>• Service charges for administrative functions can be high</li>
//               <li>• Building work may be overvalued</li>
//               <li>• Quality assurance for building work may be not done or inconsistent</li>
//             </ul>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }