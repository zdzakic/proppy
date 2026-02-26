/**
 * OverviewSection
 *
 * Purpose:
 * Explains how traditional property management structures work.
 * Keeps client text intact, improves hierarchy and premium feel.
 *
 * Why this structure:
 * - Mobile first
 * - Minimal surface cards for depth
 * - Subtle emphasis on core responsibility gaps
 * - No heavy layout logic (KISS)
 */

import { Users, ShieldCheck, Building2 } from "lucide-react";
import OverviewCard from "@/components/ui/OverviewCard";

export default function OverviewSection() {
  return (
    <section
      id="overview"
      className="relative bg-brand-bg text-brand-text py-24 overflow-hidden"
    >
      {/* Subtle premium background glow (very light, not distracting) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top,white,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* ========================================= */}
        {/* SECTION LABEL */}
        {/* ========================================= */}
        <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
          Overview
        </p>

        {/* ========================================= */}
        {/* SECTION TITLE */}
        {/* ========================================= */}
        <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
          How Property Management Typically Works
        </h2>

        {/* ========================================= */}
        {/* INTRODUCTION TEXT */}
        {/* ========================================= */}
        <p className="max-w-3xl text-lg text-brand-muted leading-relaxed mb-16">
          If you own a flat, either the block it’s in is self-managed or a property management company is running it on your behalf.
          The block will have its own company and each owner will own one share in the company.
          That company will have Directors who are Owners who volunteer. Typically three Directors, but it can be any number.
          These Directors liaise with the{" "}
          <strong className="text-brand-text">
            Property Management Company
          </strong>.
        </p>

        {/* ========================================= */}
        {/* 3 ROLE COLUMNS */}
        {/* ========================================= */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* ================= OWNERS ================= */}
            <OverviewCard
                icon={<Users className="w-6 h-6 text-brand-accent" />}
                title="Owners"
                emphasis="Often left unsure what they are truly paying for."
                >
                <p>Rely on the Directors to represent them.</p>
                <p>Are generally not interested in how things work.</p>
                <p>They get the bill and pay.</p>
                <p>Some are not even aware that there are Directors representing them.</p>
            </OverviewCard>

          {/* ================= DIRECTORS ================= */}
            <OverviewCard
                icon={<ShieldCheck className="w-6 h-6 text-brand-accent" />}
                title="Directors"
                emphasis="Responsibility sits with them, but operational control often does not."
                >
                <p>Rely on the Property Management Company to take care of things.</p>
                <p>Very often don’t question what or why things are done.</p>
                <p>Attend AGMs and make decisions on advice of the Property Management Company.</p>
            </OverviewCard>

          {/* ================= MANAGEMENT COMPANY ================= */}
            <OverviewCard
            icon={<Building2 className="w-6 h-6 text-brand-accent" />}
            title="Management Company"
            emphasis="Their primary obligation is to deliver the service profitably."
            >
            <p>Operates the block on a contractual basis.</p>
            <p>Owners and Directors rely on them for financial management, maintenance coordination and compliance.</p>
            </OverviewCard>

        </div>
      </div>
    </section>
  );
}

// export default function OverviewSection() {
//   return (
//     <section
//       id="overview"
//       className="bg-brand-bg text-brand-text py-24"
//     >
//       <div className="max-w-6xl mx-auto px-6">

//         {/* Section Label */}
//         <p className="text-sm uppercase tracking-[0.2em] text-brand-accent mb-4">
//           Overview
//         </p>

//         {/* Section Title */}
//         <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
//           How Property Management Typically Works
//         </h2>

//         {/* Intro */}
//         <p className="max-w-3xl text-lg text-brand-muted leading-relaxed mb-16">
//           If you own a flat, either the block its in, is self-managed or a property management company is running it on your behalf.
//           The block will have its own company and each owner will own one share in the company. 
//           That company will have Directors who are Owners who volunteer. Typically 3 Directors but it can be any number.
//           These Directors liaise with the <strong>Property Management Company</strong>.
//         </p>

//         {/* 3 Columns */}
//         <div className="grid md:grid-cols-3 gap-12">

//           <div>
//             <h3 className="font-display text-2xl mb-4">
//               Owners
//             </h3>
//             <p className="text-brand-muted leading-relaxed">
//               Erely on the Directors to represent them. Are generally not interested on how things work. 
//               They get the bill and pay. Some are not even aware that there are Directors representing them. 
//               Often left with the feeling the bills are high and not sure what they are paying for.
//             </p>
//           </div>

//           <div>
//             <h3 className="font-display text-2xl mb-4">
//               Directors
//             </h3>
//             <p className="text-brand-muted leading-relaxed">
//               Rely on the Property Management Company to take care of things. Very often dont question what or why things are done. 
//               Attend AGMs and make decisions on advise of the Property Management Company.
//             </p>
//           </div>

//           <div>
//             <h3 className="font-display text-2xl mb-4">
//               Management Company
//             </h3>
//             <p className="text-brand-muted leading-relaxed">
//               Google the consequence of not being on-top of the Property Management Company. 
//               They do not have your interest at heart. Their interest is the bottom line.
//             </p>
//           </div>

//         </div>
        
//       </div>
//     </section>
//   );
// }