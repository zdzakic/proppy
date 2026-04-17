"use client";

import ActionButton from "@/components/ui/ActionButton";
import BaseModal from "@/components/ui/modal/BaseModal";
import type { PropertyOwner, PropertyDetails } from "@/types/property";


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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Property Details"
      subtitle={blockName ? `Block: ${blockName}` : undefined}
      maxWidthClassName="max-w-lg"
    >
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
    </BaseModal>
  );
}
