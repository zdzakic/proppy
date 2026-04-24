"use client";

import { useEffect, useState } from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import OwnerForm from "@/components/forms/OwnerForm";
import type { PropertyOwner, PropertyWithMeta } from "@/types/property";
import type { OwnerFormValues } from "@/components/forms/OwnerForm";

type OwnerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "assign" | "edit";
  /** Bumps when the modal opens so the form resets to current server values. */
  formSession: number;
  property: PropertyWithMeta | null;
  isSubmitting: boolean;
  error: string | null;
  emailApiError: string | null;
  onClearErrors: () => void;
  onSubmit: (values: OwnerFormValues) => void;
};

/**
 * OwnerModal
 *
 * What it does: Wraps OwnerForm in BaseModal for assign/update owner flows.
 * Why it exists: Same thin-wrapper pattern as AddPropertyModal / AddCompanyModal.
 * What would break if removed: OwnersManager could not present owner forms modally.
 */

function splitDisplayName(displayName?: string): { first: string; last: string } {
  const trimmed = displayName?.trim();
  if (!trimmed) return { first: "", last: "" };

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };

  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function ownerToFormDefaults(owner: PropertyOwner): Partial<OwnerFormValues> {
  const split = splitDisplayName(owner.display_name);

  return {
    email: owner.user_email ?? "",
    first_name: owner.user_first_name ?? split.first,
    last_name: owner.user_last_name ?? split.last,
    phone: owner.user_phone ?? "",
    address_1: owner.user_address_1 ?? "",
    postcode: owner.user_postcode ?? "",
    country: owner.user_country ?? "",
  };
}

export default function OwnerModal({
  isOpen,
  onClose,
  mode,
  formSession,
  property,
  isSubmitting,
  error,
  emailApiError,
  onClearErrors,
  onSubmit,
}: OwnerModalProps) {
  const owner = property?.owners?.[0];

  /**
   * liveDefaults — reactive form seed.
   * Why: defaultValues computed inline is a snapshot; if `property` carries
   *   stale owner data at render time the form opens with old values.
   * Pattern: keep defaults in state and re-derive them inside a useEffect so
   *   the form always reflects the latest owner whenever the modal opens.
   */
  const [liveDefaults, setLiveDefaults] = useState<Partial<OwnerFormValues> | undefined>(
    () => (mode === "edit" && owner ? ownerToFormDefaults(owner) : undefined),
  );

  // Every time the modal opens (or the property/mode changes while open),
  // sync liveDefaults from the current owner data.
  useEffect(() => {
    if (!isOpen) return;
    const currentOwner = property?.owners?.[0];
    setLiveDefaults(
      mode === "edit" && currentOwner ? ownerToFormDefaults(currentOwner) : undefined,
    );
  }, [isOpen, property, mode]);

  // Stable fingerprint when API sends updated profile fields so the form key changes after refetch.
  const ownerDataFingerprint = owner
    ? [
        owner.id,
        owner.user_email ?? "",
        owner.display_name ?? "",
        owner.user_first_name ?? "",
        owner.user_last_name ?? "",
        owner.user_phone ?? "",
        owner.user_address_1 ?? "",
        owner.user_postcode ?? "",
        owner.user_country ?? "",
      ].join("|")
    : "no-owner";

  const title = mode === "assign" ? "Assign Owner" : "Update Owner";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={property?.name ? `Property: ${property.name}` : undefined}
      maxWidthClassName="max-w-xl"
    >
      {property ? (
        <OwnerForm
          key={`session-${formSession}-prop-${property.id}-${mode}-o-${owner?.id ?? "new"}-${ownerDataFingerprint}`}
          defaultValues={liveDefaults}
          onSubmit={(values) => onSubmit(values)}
          isSubmitting={isSubmitting}
          error={error}
          emailApiError={emailApiError}
          onClearApiErrors={onClearErrors}
          onCancel={onClose}
          submitLabel="Save"
        />
      ) : null}
    </BaseModal>
  );
}
