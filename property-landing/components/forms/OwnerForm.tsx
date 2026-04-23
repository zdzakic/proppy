"use client";

import { useEffect, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import FormError from "@/components/ui/FormError";
import FormInput from "@/components/ui/FormInput";

/**
 * OwnerFormValues
 *
 * What it does: Payload shape for assign/update owner modal (matches owner create API body).
 * Why it exists: Single source of truth shared by OwnerForm UI and usePropertyOwnerSave hook.
 * What would break if removed: Hook and form would drift on field names.
 */
export type OwnerFormValues = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  postcode: string;
  country: string;
};

const EMPTY_VALUES: OwnerFormValues = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  postcode: "",
  country: "",
};

type OwnerFormProps = {
  defaultValues?: Partial<OwnerFormValues>;
  onSubmit: (values: OwnerFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
  emailApiError?: string | null;
  onClearApiErrors?: () => void;
  onCancel: () => void;
  submitLabel?: string;
};

/**
 * OwnerForm
 *
 * What it does: Collects owner fields for assign/update flows (same fields as onboarding step 3).
 * Why it exists: Follows CompanyForm/BlockForm pattern — UI-only, calls onSubmit with typed values.
 * What would break if removed: Owner modal would have no fields or validation.
 */
export default function OwnerForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  error,
  emailApiError,
  onClearApiErrors,
  onCancel,
  submitLabel = "Save",
}: OwnerFormProps) {
  const [form, setForm] = useState<OwnerFormValues>(() => ({
    ...EMPTY_VALUES,
    ...defaultValues,
  }));

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // When the modal reopens with fresh API data (new defaultValues), sync local state.
  // Serialising avoids stale closure issues with the dependency array.
  const defaultsSerialized = JSON.stringify(defaultValues ?? {});

  useEffect(() => {
    setForm({ ...EMPTY_VALUES, ...(defaultValues ?? {}) });
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultsSerialized]);

  const setField =
    (key: keyof OwnerFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      onClearApiErrors?.();
      if (key === "first_name") setFirstNameError(null);
      if (key === "last_name") setLastNameError(null);
      if (key === "email") setEmailError(null);
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const firstName = form.first_name.trim();
    const lastName = form.last_name.trim();
    const email = form.email.trim();

    let hasError = false;
    if (!firstName) {
      setFirstNameError("First name is required.");
      hasError = true;
    } else {
      setFirstNameError(null);
    }
    if (!lastName) {
      setLastNameError("Last name is required.");
      hasError = true;
    } else {
      setLastNameError(null);
    }
    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (hasError) return;

    onSubmit({
      email,
      first_name: firstName,
      last_name: lastName,
      phone: form.phone.trim(),
      address_1: form.address_1.trim(),
      postcode: form.postcode.trim(),
      country: form.country.trim(),
    });
  };

  const combinedEmailError = emailError ?? emailApiError ?? undefined;

  const isSubmitDisabled =
    !form.email.trim() || !form.first_name.trim() || !form.last_name.trim() || isSubmitting;

  const inputShellClass =
    "[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${inputShellClass}`}>
        <div className="space-y-1">
          <p className="text-sm text-dashboard-muted">First name (Required)</p>
          <FormInput
            placeholder="Ana"
            value={form.first_name}
            onChange={setField("first_name")}
            error={firstNameError ?? undefined}
            autoComplete="given-name"
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-dashboard-muted">Last name (Required)</p>
          <FormInput
            placeholder="Owner"
            value={form.last_name}
            onChange={setField("last_name")}
            error={lastNameError ?? undefined}
            autoComplete="family-name"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <p className="text-sm text-dashboard-muted">Email (Required)</p>
          <FormInput
            type="email"
            placeholder="owner@example.com"
            value={form.email}
            onChange={setField("email")}
            error={combinedEmailError}
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-dashboard-muted">Phone (Optional)</p>
          <FormInput
            placeholder="+44 64 123 456"
            value={form.phone}
            onChange={setField("phone")}
            autoComplete="tel"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <p className="text-sm text-dashboard-muted">Address (Optional)</p>
          <FormInput
            placeholder="Main Street 12"
            value={form.address_1}
            onChange={setField("address_1")}
            autoComplete="street-address"
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-dashboard-muted">Postcode (Optional)</p>
          <FormInput
            placeholder="78000"
            value={form.postcode}
            onChange={setField("postcode")}
            autoComplete="postal-code"
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-dashboard-muted">Country (Optional)</p>
          <FormInput
            placeholder="UK"
            value={form.country}
            onChange={setField("country")}
            autoComplete="country-name"
          />
        </div>
      </div>

      <FormError message={error ?? undefined} />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <ActionButton
          type="button"
          onClick={onCancel}
          variant="neutral"
          fullWidth
          className="sm:w-auto"
          disabled={isSubmitting}
        >
          Cancel
        </ActionButton>

        <ActionButton
          type="submit"
          variant="primary"
          fullWidth
          className="sm:w-auto disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-accent dark:bg-brand-accent dark:text-dashboard-sidebar dark:hover:opacity-95"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </ActionButton>
      </div>
    </form>
  );
}
