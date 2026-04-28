"use client";

/**
 * DatePickerInput
 * What: Controlled date input that shows a compact calendar popup.
 * Why: Native <input type="date"> has inconsistent cross-browser chrome and can't be themed.
 * Break: Date fields fall back to the browser-native picker with no custom styling.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";

type DatePickerInputProps = {
  id?: string;
  /** Controlled value in "YYYY-MM-DD" format — same as native date input. */
  value: string;
  onChange: (value: string) => void;
};

// LEARN: These helpers replace date-fns to avoid an extra dependency.
// We only need parse/format for the simple "YYYY-MM-DD" wire format.
function parseYMD(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? undefined : dt;
}

function toYMD(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function toLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const POPUP_HEIGHT = 300; // approximate calendar height in px
const GAP = 4;

// Matches the input style used throughout the dashboard forms.
const TRIGGER_CLASS =
  "w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-dashboard-ring";

export default function DatePickerInput({ id, value, onChange }: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  // LEARN: position: fixed + getBoundingClientRect lets the popup escape any
  // overflow:hidden or overflow-y:auto ancestor (like a modal scroll container).
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const selected = parseYMD(value);

  const openPopup = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    // Open upward if there isn't enough space below.
    const top =
      spaceBelow >= POPUP_HEIGHT
        ? rect.bottom + GAP
        : rect.top - POPUP_HEIGHT - GAP;
    setCoords({ top, left: rect.left, width: rect.width });
    setOpen(true);
  };

  // Close on outside click (checks both trigger and popup).
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popupRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const handleSelect = (day: Date | undefined) => {
    if (day) onChange(toYMD(day));
    setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={openPopup}
        className={TRIGGER_CLASS}
      >
        {selected ? (
          <span className="text-dashboard-text">{toLabel(selected)}</span>
        ) : (
          <span className="text-dashboard-muted">Pick a date</span>
        )}
      </button>

      {open && coords &&
        createPortal(
          <div
            ref={popupRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, minWidth: coords.width, zIndex: 9999 }}
            className="rounded-md border border-dashboard-border bg-dashboard-surface p-2 shadow-lg"
          >
            <DayPicker mode="single" selected={selected} onSelect={handleSelect} />
          </div>,
          document.body,
        )}
    </>
  );
}
