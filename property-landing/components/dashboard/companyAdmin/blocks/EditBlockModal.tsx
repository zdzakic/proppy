"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import BlockForm, { type BlockFormValues } from "@/components/forms/BlockForm";

type EditableBlock = {
  id: number;
  name: string;
  comment?: string;
};

type EditBlockModalProps = {
  isOpen: boolean;
  block: EditableBlock | null;
  isSaving: boolean;
  error: string | null;
  /** Called with { name } when the user submits. API call lives in the hook. */
  onSave: (payload: { name: string }) => Promise<void>;
  onClose: () => void;
};

/**
 * Thin wrapper: opens BaseModal with BlockForm inside for the "Edit Block" flow.
 * Passes the current block name as defaultValues so the form starts pre-filled.
 */
export default function EditBlockModal({
  isOpen,
  block,
  isSaving,
  error,
  onSave,
  onClose,
}: EditBlockModalProps) {
  if (!block) return null;

  const handleSubmit = (values: BlockFormValues) => {
    void onSave({ name: values.name });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Block"
      maxWidthClassName="max-w-xl"
    >
      <BlockForm
        defaultValues={{ name: block.name }}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
        error={error}
        submitLabel="Save Changes"
        onCancel={onClose}
      />
    </BaseModal>
  );
}
