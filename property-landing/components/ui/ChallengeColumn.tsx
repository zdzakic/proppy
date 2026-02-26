/**
 * ChallengeColumn
 *
 * Purpose:
 * Displays structured problem points in editorial style.
 *
 * Why:
 * - Avoids repetitive card layout
 * - Creates contrast with Overview section
 * - Adds visual rhythm without images
 */

import { ReactNode } from "react";

interface ChallengeColumnProps {
  title: string;
  children: ReactNode;
}

export default function ChallengeColumn({
  title,
  children,
}: ChallengeColumnProps) {
  return (
    <div className="relative">
        <h3 className="font-display text-2xl mb-8">
            {title}
        </h3>
            <div className="space-y-6">
            {children}
            </div>
        </div>
  );
}