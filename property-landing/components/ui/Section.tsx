/**
 * Section Component
 *
 * ZAŠTO:
 * Centralizuje vertikalni spacing između sekcija.
 * Omogućava premium whitespace rhythm.
 *
 * KORISTI SE:
 * Kao wrapper za Hero, Services, CTA itd.
 */

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Section({ children, className = "" }: Props) {
  return (
    <section className={`py-24 ${className}`}>
      {children}
    </section>
  );
}
