"use client";

import { Plus, X } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  value: string;
  setValue: (v: string) => void;
  loading: boolean;
};

export default function AddBlockModal({
  isOpen,
  onClose,
  onCreate,
  value,
  setValue,
  loading,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-xl border border-dashboard-border bg-dashboard-surface p-4 shadow-premium sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dashboard-text">Add Block</h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-2 text-dashboard-text transition-colors hover:bg-dashboard-hover"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Block name"
          className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ActionButton
            onClick={onClose}
            variant="neutral"
            fullWidth
            className="sm:w-auto"
          >
            Cancel
          </ActionButton>

          <ActionButton
            onClick={onCreate}
            disabled={!value.trim() || loading}
            variant="primary"
            fullWidth
            className="sm:w-auto disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-accent dark:bg-brand-accent dark:text-dashboard-sidebar dark:hover:opacity-95"
          >
            <Plus size={14} />
            {loading ? "Saving..." : "Save"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}