"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import PropertyForm, { type PropertyFormValues } from "@/components/forms/PropertyForm";

type EditableProperty = {
  id: number;
  name: string;
  comment?: string;
};

type EditPropertyModalProps = {
  isOpen: boolean;
  property: EditableProperty | null;
  isSaving: boolean;
  error: string | null;
  /** Called with { name, comment } when the user submits. API call lives in the hook. */
  onSave: (payload: { name: string; comment: string }) => Promise<void>;
  onClose: () => void;
};

/**
 * Thin wrapper: opens BaseModal with PropertyForm for the "Edit Property" flow.
 * Passes the current property as defaultValues so the form starts pre-filled.
 */
export default function EditPropertyModal({
  isOpen,
  property,
  isSaving,
  error,
  onSave,
  onClose,
}: EditPropertyModalProps) {
  if (!property) return null;

  const handleSubmit = (values: PropertyFormValues) => {
    void onSave(values);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Property"
      maxWidthClassName="max-w-xl"
    >
      <PropertyForm
        defaultValues={{ name: property.name, comment: property.comment ?? "" }}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
        error={error}
        submitLabel="Save Changes"
        onCancel={onClose}
      />
    </BaseModal>
  );
}
