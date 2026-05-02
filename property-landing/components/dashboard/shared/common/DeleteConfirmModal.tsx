"use client";

import { AlertTriangle, X } from "lucide-react";

import ActionButton from "@/components/ui/ActionButton";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmLabel: string;
  description: string;
  /** Stack above another `z-50` overlay (default `z-50`). */
  stackClassName?: string;
};

export default function DeleteConfirmModal({
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
  title,
  confirmLabel,
  description,
  stackClassName,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-dashboard-sidebar/40 p-3 sm:items-center sm:p-4 ${stackClassName ?? "z-50"}`}
    >
      <div className="w-full max-w-lg rounded-xl border border-error/60 bg-dashboard-surface p-4 shadow-premium sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle size={18} />
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-2 text-dashboard-text transition-colors hover:bg-dashboard-hover"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <X size={16} />
          </button>
        </div>

        <div className="rounded-lg border border-error/40 bg-error/5 p-3">
          <p className="text-sm text-dashboard-text">{description}</p>
          <p className="mt-1 text-xs text-dashboard-muted">This action cannot be undone.</p>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ActionButton
            onClick={onClose}
            variant="neutral"
            fullWidth
            className="sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </ActionButton>

          <ActionButton
            onClick={onConfirm}
            variant="danger"
            fullWidth
            className="sm:w-auto border-error bg-error text-white hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : confirmLabel}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
