/**
 * ChallengeItem
 *
 * Purpose:
 * Displays a single challenge statement
 * separated by subtle divider.
 */

interface ChallengeItemProps {
  text: string;
}

export function ChallengeItem({ text }: ChallengeItemProps) {
  return (
   <div className="pb-4 border-b border-brand-border/40 transition-all duration-200 hover:translate-x-1">
    <p className="text-brand-muted leading-relaxed hover:text-brand-text">
        {text}
    </p>
</div>
  );
}