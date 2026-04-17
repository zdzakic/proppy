"use client";

import { X } from "lucide-react";

import AddPropertyForm from "../properties/AddPropertyForm";
import type { CreatePropertyResponse } from "@/types/property";

type AddPropertyModalProps = {
  isOpen: boolean;
  blockId: number | null;
  blockName?: string;
  onClose: () => void;
  onCreated?: (property: CreatePropertyResponse) => void;
};

export default function AddPropertyModal({
  isOpen,
  blockId,
  blockName,
  onClose,
  onCreated,
}: AddPropertyModalProps) {
  if (!isOpen || !blockId) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-xl rounded-xl border border-dashboard-border bg-dashboard-surface p-4 shadow-premium sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Add Property</h2>
            {blockName ? (
              <p className="text-xs text-dashboard-muted">Block: {blockName}</p>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-2 text-dashboard-text transition-colors hover:bg-dashboard-hover"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <AddPropertyForm
          blockId={blockId}
          onCreated={(property) => {
            onCreated?.(property);
            onClose();
          }}
          onCancel={onClose}
          submitLabel="Save Property"
        />
      </div>
    </div>
  );
}