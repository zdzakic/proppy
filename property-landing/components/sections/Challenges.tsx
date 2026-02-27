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
