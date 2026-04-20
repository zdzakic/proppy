"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import BlockForm, { type BlockFormValues } from "@/components/forms/BlockForm";

type CompanyOption = {
  id: number;
  name: string;
};

type AddBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Called with form values when the user submits. API call lives in the hook. */
  onSubmit: (values: BlockFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
  companyOptions?: CompanyOption[];
};

/**
 * Thin wrapper: opens BaseModal with BlockForm inside for the "Add Block" flow.
 * No business logic here — onSubmit wires to useBlocksManager.handleCreate.
 */
export default function AddBlockModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  companyOptions = [],
}: AddBlockModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Block"
      maxWidthClassName="max-w-md"
    >
      <BlockForm
        companyOptions={companyOptions}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        error={error}
        submitLabel="Save"
        onCancel={onClose}
      />
    </BaseModal>
  );
}
