"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import CompanyForm, { type CompanyFormValues } from "@/components/forms/CompanyForm";

type AddCompanyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Called with form values when the user submits. API call lives in the hook. */
  onSubmit: (values: CompanyFormValues) => void;
  isSubmitting: boolean;
};

/**
 * Thin wrapper: opens BaseModal with CompanyForm inside for the "Add Company" flow.
 * No business logic here — onSubmit wires to useCompaniesManager.handleCreateCompany.
 */
export default function AddCompanyModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddCompanyModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Company"
      maxWidthClassName="max-w-md"
    >
      <CompanyForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save"
        onCancel={onClose}
      />
    </BaseModal>
  );
}
