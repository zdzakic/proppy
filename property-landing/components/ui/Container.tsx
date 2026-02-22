/**
 * Container Component
 *
 * ZAŠTO:
 * Centralizuje maksimalnu širinu i horizontalni spacing.
 * Omogućava konzistentan layout kroz cijeli sajt.
 *
 * KORISTI SE:
 * Omotava sve sekcije.
 */

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return (
    <div className={`max-w-6xl mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}
