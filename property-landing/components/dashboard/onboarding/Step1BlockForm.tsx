"use client";

import ActionButton from "@/components/ui/ActionButton";
import FormInput from "@/components/ui/FormInput";

type CompanyOption = {
  id: number;
  name: string;
};

export type Step1BlockFormProps = {
  selectedCompany: CompanyOption | null;
  showCompanySelect: boolean;
  companies: CompanyOption[];
  selectedCompanyId: number | null;
  onCompanyChange: (companyId: number | null) => void;
  blockName: string;
  onBlockNameChange: (value: string) => void;
  error: string | null;
  loading: boolean;
  step1NextDisabled: boolean;
  onNext: () => void;
  btnClass: string;
};

export default function Step1BlockForm({
  selectedCompany,
  showCompanySelect,
  companies,
  selectedCompanyId,
  onCompanyChange,
  blockName,
  onBlockNameChange,
  error,
  loading,
  step1NextDisabled,
  onNext,
  btnClass,
}: Step1BlockFormProps) {
  return (
    <>
      <div className="flex flex-col gap-4 border-b border-dashboard-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 md:px-8 md:py-6">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-dashboard-muted">
            Step 1 of 2
          </p>
          <h3 className="text-lg font-semibold text-dashboard-text">
            Set up your property structure
          </h3>
          {selectedCompany ? (
            <p className="text-sm text-dashboard-muted">
              Company:{" "}
              <span className="font-medium text-dashboard-text">
                {selectedCompany.name}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-5 md:px-8 md:py-6">
        <p className="text-xs text-dashboard-muted">
          A block represents a building or property group. Start by adding your
          first one.
        </p>

        {showCompanySelect ? (
          <div className="w-full space-y-1 md:max-w-[420px]">
            <label
              htmlFor="onboarding-company"
              className="text-sm text-dashboard-muted"
            >
              Company
            </label>
            <select
              id="onboarding-company"
              value={selectedCompanyId ?? ""}
              onChange={(event) => {
                const raw = event.target.value;
                onCompanyChange(raw ? Number(raw) : null);
              }}
              className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
            >
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <fieldset
          disabled={loading}
          className="m-0 w-full border-0 p-0 disabled:pointer-events-none disabled:opacity-60 md:max-w-[420px]"
        >
          <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
            <FormInput
              placeholder="Block name"
              value={blockName}
              onChange={(event) => {
                onBlockNameChange(event.target.value);
              }}
              error={error ?? undefined}
              autoComplete="off"
            />
          </div>
        </fieldset>

        <div className="mt-auto flex justify-end pt-2">
          <ActionButton
            type="button"
            variant="neutral"
            fullWidth
            className={btnClass}
            disabled={step1NextDisabled}
            onClick={() => void onNext()}
          >
            {loading ? "Saving..." : "Next"}
          </ActionButton>
        </div>
      </div>
    </>
  );
}
