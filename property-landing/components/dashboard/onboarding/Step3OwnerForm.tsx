"use client";

import { useState } from "react";

import ActionButton from "@/components/ui/ActionButton";
import FormError from "@/components/ui/FormError";
import FormInput from "@/components/ui/FormInput";
import apiClient from "@/utils/api/apiClient";

export type Step3OwnerFormProps = {
  blockId: number;
  propertyId: number;
  onSuccess: () => void;
  onBack: () => void;
};

type OwnerFormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  postcode: string;
  country: string;
};

/**
 * Step3OwnerForm
 *
 * What it does: Creates a property owner by posting owner details to the backend.
 * Why it exists: Onboarding needs a final step to attach the first owner to the created property.
 * What would break if removed: Users finish onboarding without an owner linked to their property.
 */
export default function Step3OwnerForm({
  blockId,
  propertyId,
  onSuccess,
  onBack,
}: Step3OwnerFormProps) {
  const [form, setForm] = useState<OwnerFormState>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    postcode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const setField =
    (key: keyof OwnerFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setApiError(null);
      if (key === "first_name") setFirstNameError(null);
      if (key === "last_name") setLastNameError(null);
      if (key === "email") setEmailError(null);
    };

  const handleSubmit = async () => {
    const firstName = form.first_name.trim();
    const lastName = form.last_name.trim();
    const email = form.email.trim();

    if (!firstName) {
      setFirstNameError("First name is required.");
    }

    if (!lastName) {
      setLastNameError("Last name is required.");
    }

    if (!email) {
      setEmailError("Email is required.");
    }

    if (!firstName || !lastName || !email) return;

    setLoading(true);
    setApiError(null);
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);

    try {
      await apiClient.post(
        `/properties/blocks/${blockId}/properties/${propertyId}/owners/create/`,
        {
          email,
          first_name: firstName,
          last_name: lastName,
          phone: form.phone.trim(),
          address_1: form.address_1.trim(),
          postcode: form.postcode.trim(),
          country: form.country.trim(),
        }
      );

      onSuccess();
    } catch (unknownError: unknown) {
      const maybeError = unknownError as {
        response?: {
          status?: number;
          data?: {
            detail?: string;
            message?: string;
            email?: string[] | string;
          };
        };
      };

      const message =
        maybeError.response?.data?.detail ||
        maybeError.response?.data?.message ||
        (Array.isArray(maybeError.response?.data?.email)
          ? maybeError.response?.data?.email?.[0]
          : maybeError.response?.data?.email) ||
        (maybeError.response?.status === 400
          ? "Please check the form fields and try again."
          : "Something went wrong. Please try again.");

      const emailMessage = Array.isArray(maybeError.response?.data?.email)
        ? maybeError.response?.data?.email?.[0]
        : maybeError.response?.data?.email;

      if (typeof emailMessage === "string" && emailMessage.trim()) {
        setEmailError(emailMessage);
      } else {
        setApiError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const btnClass =
    "sm:w-[160px] border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover";

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-dashboard-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 md:px-8 md:py-6">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-dashboard-muted">
            Step 3 of 3
          </p>
          <h3 className="text-lg font-semibold text-dashboard-text">
            Add the first owner to the Property
          </h3>
          <p className="text-sm text-dashboard-muted">
            This owner will be linked to your newly created property.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-5 md:px-8 md:py-6">
        <fieldset
          disabled={loading}
          className="m-0 w-full border-0 p-0 disabled:pointer-events-none disabled:opacity-60 md:max-w-[760px]"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="owner-first-name"
                className="text-xs text-dashboard-muted"
              >
                First name (Required)
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="Ana"
                  value={form.first_name}
                  onChange={setField("first_name")}
                  error={firstNameError ?? "\u00A0"}
                  autoComplete="given-name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="owner-last-name"
                className="text-xs text-dashboard-muted"
              >
                Last name (Required)
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="Owner"
                  value={form.last_name}
                  onChange={setField("last_name")}
                  error={lastNameError ?? "\u00A0"}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="owner-email"
                className="text-xs text-dashboard-muted"
              >
                Email (Required)
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  type="email"
                  placeholder="owner@example.com"
                  value={form.email}
                  onChange={setField("email")}
                  error={emailError ?? "\u00A0"}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="owner-phone"
                className="text-xs text-dashboard-muted"
              >
                Phone (Optional)
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="+44 64 123 456"
                  value={form.phone}
                  onChange={setField("phone")}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label
                htmlFor="owner-address"
                className="text-xs text-dashboard-muted"
              >
                Address (Optional)
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="Main Street 12"
                  value={form.address_1}
                  onChange={setField("address_1")}
                  autoComplete="street-address"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="owner-postcode"
                className="text-xs text-dashboard-muted"
              >
                Postcode (Optional)
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="78000"
                  value={form.postcode}
                  onChange={setField("postcode")}
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="owner-country"
                className="text-xs text-dashboard-muted"
              >
                Country (Optional)
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="UK"
                  value={form.country}
                  onChange={setField("country")}
                  autoComplete="country-name"
                />
              </div>
            </div>
          </div>
        </fieldset>

        <FormError message={apiError ?? undefined} />

        <div className="mt-auto flex justify-end gap-2 pt-2">
          <ActionButton
            type="button"
            variant="neutral"
            fullWidth
            className="sm:w-[140px] border-dashboard-border text-dashboard-muted shadow-sm hover:bg-dashboard-hover"
            disabled={loading}
            onClick={onBack}
          >
            ← Back
          </ActionButton>

          <ActionButton
            type="button"
            variant="neutral"
            fullWidth
            className={btnClass}
            disabled={loading}
            onClick={() => void handleSubmit()}
          >
            {loading ? "Saving..." : "Finish setup"}
          </ActionButton>
        </div>
      </div>
    </>
  );
}

