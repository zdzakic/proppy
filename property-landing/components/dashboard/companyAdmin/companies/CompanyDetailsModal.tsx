"use client";

import ActionButton from "@/components/ui/ActionButton";
import BaseModal from "@/components/ui/modal/BaseModal";
import type { Company } from "@/types/company";

type CompanyDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
};

export default function CompanyDetailsModal({
  isOpen,
  onClose,
  company,
}: CompanyDetailsModalProps) {
  const companyName = company?.name ?? "Company details";
  const addressText = company?.address?.trim()
    ? company.address
    : "No address provided";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={companyName}
      subtitle="Company information"
      maxWidthClassName="max-w-3xl"
    >
      <div className="space-y-4">
        {company ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Name", value: company.name },
              { label: "Address", value: addressText },
              { label: "Blocks", value: company.block_count ?? 0 },
              { label: "Properties", value: company.property_count ?? 0 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-dashboard-border bg-dashboard-hover/50 p-3"
              >
                <dt className="text-[11px] uppercase tracking-wide text-dashboard-muted">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-dashboard-text">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-xs text-dashboard-muted">Loading company details...</p>
        )}

        <div className="flex justify-end">
          <ActionButton
            onClick={onClose}
            variant="neutral"
            className="border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
          >
            Close
          </ActionButton>
        </div>
      </div>
    </BaseModal>
  );
}
