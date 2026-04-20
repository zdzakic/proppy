"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import PropertyForm, { type PropertyFormValues } from "@/components/forms/PropertyForm";
import { useCreateProperty } from "@/hooks/useCreateProperty";
import type { CreatePropertyResponse } from "@/types/property";

type AddPropertyModalProps = {
  isOpen: boolean;
  blockId: number | null;
  blockName?: string;
  onClose: () => void;
  onCreated?: (property: CreatePropertyResponse) => void;
};

/**
 * Thin wrapper: opens BaseModal with PropertyForm for the "Add Property" flow.
 * Owns the API call (useCreateProperty) so PropertyForm stays UI-only.
 */
export default function AddPropertyModal({
  isOpen,
  blockId,
  blockName,
  onClose,
  onCreated,
}: AddPropertyModalProps) {
  const { createProperty, isLoading, error, clearError } = useCreateProperty();

  if (!blockId) return null;

  const handleSubmit = async (values: PropertyFormValues) => {
    clearError();
    const created = await createProperty(blockId, values);
    if (!created) return;
    onCreated?.(created);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Property"
      subtitle={blockName ? `Block: ${blockName}` : undefined}
      maxWidthClassName="max-w-xl"
    >
      <PropertyForm
        onSubmit={(values) => void handleSubmit(values)}
        isSubmitting={isLoading}
        error={error}
        submitLabel="Save Property"
        onCancel={onClose}
      />
    </BaseModal>
  );
}
