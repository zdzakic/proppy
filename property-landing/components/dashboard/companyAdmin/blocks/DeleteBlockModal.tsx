"use client";

import { AlertTriangle, X } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";

type BlockSummary = {
  id: number;
  name: string;
  properties?: { id: number; name: string }[];
};

type DeleteBlockModalProps = {
  isOpen: boolean;
  block: BlockSummary | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteBlockModal({
  isOpen,
  block,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteBlockModalProps) {
  if (!isOpen || !block) return null;

  const propertiesCount = block.properties?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-dashboard-sidebar/40 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-xl border border-error/60 bg-dashboard-surface p-4 shadow-premium sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle size={18} />
            <h2 className="text-lg font-semibold">Delete Block</h2>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-2 text-dashboard-text transition-colors hover:bg-dashboard-hover"
            aria-label="Close"
            disabled={isDeleting}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2 rounded-lg border border-error/40 bg-error/5 p-3">
          <p className="text-sm text-dashboard-text">
            You are about to delete block <span className="font-semibold">{block.name}</span>.
          </p>
          <p className="text-sm text-error">
            This action will also remove all properties in this block ({propertiesCount}).
          </p>
          <p className="text-xs text-dashboard-muted">This action cannot be undone.</p>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <ActionButton
            onClick={onClose}
            variant="neutral"
            fullWidth
            className="sm:w-auto"
            disabled={isDeleting}
          >
            Cancel
          </ActionButton>

          <ActionButton
            onClick={onConfirm}
            variant="danger"
            fullWidth
            className="sm:w-auto border-error bg-error text-white hover:opacity-90"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete Block"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
