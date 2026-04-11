"use client";

import { X } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";

type PropertyOwner = {
  id: number;
  user_email?: string;
  display_name?: string;
  comment?: string;
};

type PropertyDetails = {
  id: number;
  name: string;
  comment?: string;
  owners?: PropertyOwner[];
};

type PropertyDetailsModalProps = {
  isOpen: boolean;
  property: PropertyDetails | null;
  blockName?: string;
  onClose: () => void;
};

export default function PropertyDetailsModal({
  isOpen,
  property,
  blockName,
  onClose,
}: PropertyDetailsModalProps) {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-xl border border-dashboard-border bg-dashboard-surface p-4 shadow-premium sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Property Details</h2>
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

        <div className="space-y-3">
          <div className="rounded-lg border border-dashboard-border bg-dashboard-bg/60 p-3">
            <p className="text-xs text-dashboard-muted">Name</p>
            <p className="text-sm font-medium text-dashboard-text">{property.name}</p>
          </div>

          <div className="rounded-lg border border-dashboard-border bg-dashboard-bg/60 p-3">
            <p className="text-xs text-dashboard-muted">Comment</p>
            <p className="text-sm text-dashboard-text">
              {property.comment?.trim() ? property.comment : "No comment."}
            </p>
          </div>

          <div className="rounded-lg border border-dashboard-border bg-dashboard-bg/60 p-3">
            <p className="text-xs text-dashboard-muted">Owners</p>
            {property.owners && property.owners.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {property.owners.map((owner) => (
                  <li key={owner.id} className="text-sm text-dashboard-text">
                    {owner.display_name?.trim() || owner.user_email || "Unknown owner"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-dashboard-muted">No owners assigned.</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <ActionButton onClick={onClose} variant="neutral" className="w-auto">
            Close
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
