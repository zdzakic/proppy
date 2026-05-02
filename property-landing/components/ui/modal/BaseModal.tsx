"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  maxWidthClassName?: string;
  /** Stack above another modal (default `z-50`). */
  stackClassName?: string;
};

let openModalCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";
let previousScrollbarGutter = "";

function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (openModalCount === 0) {
    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    previousBodyOverflow = body.style.overflow;
    previousBodyPaddingRight = body.style.paddingRight;
    previousScrollbarGutter = body.style.scrollbarGutter;

    body.style.overflow = "hidden";
    body.style.scrollbarGutter = "stable";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  openModalCount += 1;
}

function unlockBodyScroll() {
  if (typeof document === "undefined") return;

  openModalCount = Math.max(0, openModalCount - 1);

  if (openModalCount !== 0) return;

  const body = document.body;
  body.style.overflow = previousBodyOverflow;
  body.style.paddingRight = previousBodyPaddingRight;
  body.style.scrollbarGutter = previousScrollbarGutter;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  actions,
  children,
  maxWidthClassName = "max-w-5xl",
  stackClassName,
}: BaseModalProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 flex items-end justify-center bg-dashboard-sidebar/40 p-3 sm:items-center sm:p-4 ${stackClassName ?? "z-50"}`}
    >
      <div
        className={`w-full overflow-hidden rounded-xl border border-dashboard-border bg-dashboard-surface shadow-premium ${maxWidthClassName}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-start justify-between gap-3 border-b border-dashboard-border p-4 sm:p-6">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-lg font-semibold text-dashboard-text">
              {title}
            </h2>
            {subtitle ? <p className="text-xs text-dashboard-muted">{subtitle}</p> : null}
          </div>

          <div className="flex items-center gap-2">
            {actions}

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-2 text-dashboard-text transition-colors hover:bg-dashboard-hover"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
