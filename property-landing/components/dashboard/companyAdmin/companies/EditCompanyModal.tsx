"use client";

import BaseModal from "@/components/ui/modal/BaseModal";
import CompanyForm, { type CompanyFormValues } from "@/components/forms/CompanyForm";
import type { Company } from "@/types/company";

type EditCompanyModalProps = {
  isOpen: boolean;
  company: Company | null;
  isSaving: boolean;
  error: string | null;
  /** Called with { name, address } when the user submits. API call lives in the hook. */
  onSave: (payload: { name: string; address: string }) => Promise<void>;
  onClose: () => void;
};

/**
 * Thin wrapper: opens BaseModal with CompanyForm for the "Edit Company" flow.
 * Passes the current company as defaultValues so the form starts pre-filled.
 */
export default function EditCompanyModal({
  isOpen,
  company,
  isSaving,
  error,
  onSave,
  onClose,
}: EditCompanyModalProps) {
  if (!company) return null;

  const handleSubmit = (values: CompanyFormValues) => {
    void onSave(values);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Company"
      maxWidthClassName="max-w-xl"
    >
      <CompanyForm
        defaultValues={{ name: company.name, address: company.address ?? "" }}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
        error={error}
        submitLabel="Save Changes"
        onCancel={onClose}
      />
    </BaseModal>
  );
}
