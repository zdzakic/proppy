"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ActionButton from "@/components/ui/ActionButton";
import FormInput from "@/components/ui/FormInput";
import FormError from "@/components/ui/FormError";
import apiClient from "@/utils/api/apiClient";
import { useCreateProperty } from "@/hooks/useCreateProperty";
import type { Block } from "@/types/Block";
import { ROUTES } from "@/config/routes";

type AdminCompany = {
  id: number;
  name: string;
};

type CompaniesResponse = {
  results?: AdminCompany[];
};

function normalizeCompanies(data: unknown): AdminCompany[] {
  if (Array.isArray(data)) {
    return data as AdminCompany[];
  }

  const maybePaginated = data as CompaniesResponse;
  if (Array.isArray(maybePaginated?.results)) {
    return maybePaginated.results;
  }

  return [];
}

export default function BlocksStep() {
  const router = useRouter();

  // ── Step 1 ────────────────────────────────────────────────────────────
  const [blockName, setBlockName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  // ── Step tracking ─────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2>(1);
  const [createdBlock, setCreatedBlock] = useState<Block | null>(null);

  // ── Step 2 ────────────────────────────────────────────────────────────
  const [propertyName, setPropertyName] = useState("");
  const [propertyComment, setPropertyComment] = useState("");
  const [propertyNameError, setPropertyNameError] = useState<string | null>(null);
  const {
    createProperty,
    isLoading: propLoading,
    error: propApiError,
    clearError: clearPropError,
  } = useCreateProperty();

  // ── Initial load ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setError(null);

      try {
        const [blocksRes, companiesRes] = await Promise.all([
          apiClient.get("/properties/blocks/"),
          apiClient.get("/users/companies/"),
        ]);

        if (cancelled) return;

        const nextBlocks = Array.isArray(blocksRes.data)
          ? (blocksRes.data as Block[])
          : [];

        if (nextBlocks.length > 0) {
          router.replace(ROUTES.DASHBOARD_PAGES.COMPANY_ADMIN.PROPERTIES);
          return;
        }

        setBlocks(nextBlocks);

        const nextCompanies = normalizeCompanies(companiesRes.data);
        setCompanies(nextCompanies);

        if (nextCompanies.length === 1) {
          setSelectedCompanyId(nextCompanies[0].id);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load your blocks. Try again.");
          setBlocks([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (companies.length === 1) {
      setSelectedCompanyId(companies[0].id);
      return;
    }

    setSelectedCompanyId((prev) => {
      if (prev && companies.some((c) => c.id === prev)) {
        return prev;
      }
      return null;
    });
  }, [companies]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleAddBlock = async (): Promise<Block | null> => {
    const name = blockName.trim();

    if (!name) {
      setError("Block name is required");
      return null;
    }

    if (companies.length > 1 && !selectedCompanyId) {
      setError("Please select a company.");
      return null;
    }

    if (!selectedCompanyId) {
      setError("Company is not ready yet.");
      return null;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.post<Block>("/properties/blocks/", {
        name,
        company: selectedCompanyId,
      });

      return res.data;
    } catch (unknownError: unknown) {
      const maybeError = unknownError as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };

      const message =
        maybeError.response?.data?.detail ||
        maybeError.response?.data?.message ||
        "Failed to create block.";

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep1 = async () => {
    // Block already created — go to step 2 without a second API call
    if (createdBlock) {
      setStep(2);
      return;
    }

    const block = await handleAddBlock();
    if (block) {
      setCreatedBlock(block);
      setStep(2);
    }
  };

  const handleGoBack = () => {
    if (createdBlock) {
      setBlockName(createdBlock.name);
    }
    setError(null);
    setStep(1);
  };

  const handleSaveProperty = async () => {
    const name = propertyName.trim();

    if (!name) {
      setPropertyNameError("Property name is required");
      return;
    }

    if (!createdBlock) return;

    const property = await createProperty(createdBlock.id, {
      name,
      comment: propertyComment.trim(),
    });

    if (property) {
      toast.success(
        `U firmi je dodat blok "${createdBlock.name}" sa nekretninom "${name}".`
      );
      router.push(ROUTES.DASHBOARD_PAGES.COMPANY_ADMIN.PROPERTIES);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────
  const showCompanySelect = companies.length > 1;

  const step1NextDisabled =
    loading ||
    (showCompanySelect && !selectedCompanyId) ||
    !selectedCompanyId;

  const selectedCompany =
    companies.find((c) => c.id === selectedCompanyId) ?? null;

  const btnClass =
    "sm:w-[140px] border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover";

  // ── Sidebar ───────────────────────────────────────────────────────────
  const stepsSidebar = (
    <aside
      aria-label="Setup steps"
      className="flex w-full shrink-0 flex-col border-b border-dashboard-border bg-dashboard-sidebar md:w-[220px] md:border-b-0 md:border-r md:border-r-white/10"
    >
      <div className="px-5 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Setup
        </p>

        <nav
          className="relative mt-7 flex flex-col"
          aria-label="Onboarding steps"
        >
          {/* Vertical connector */}
          <div className="absolute left-[17px] top-10 h-[calc(100%-40px)] w-px bg-white/10" />

          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div
              className={`relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm shadow-sm ${
                step === 2
                  ? "bg-dashboard-active font-bold text-white"
                  : "bg-white font-bold text-dashboard-sidebar"
              }`}
            >
              {step === 2 ? <Check size={16} /> : "1"}
            </div>
            <div className="py-1">
              <p
                className={`text-sm font-semibold ${
                  step === 2 ? "text-white/50" : "text-white"
                }`}
              >
                Add Block
              </p>
              <p className="mt-0.5 text-xs text-white/50">Add your first block</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mt-7 flex items-start gap-3">
            <div
              className={`relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm shadow-sm ${
                step === 2
                  ? "bg-white font-bold text-dashboard-sidebar"
                  : "border border-white/15 font-medium text-white/30"
              }`}
            >
              2
            </div>
            <div className="py-1">
              <p
                className={`text-sm ${
                  step === 2
                    ? "font-semibold text-white"
                    : "font-medium text-white/40"
                }`}
              >
                Add Properties
              </p>
              <p
                className={`mt-0.5 text-xs ${
                  step === 2 ? "text-white/50" : "text-white/25"
                }`}
              >
                Manage your units
              </p>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );

  const cardClass =
    "overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-surface shadow-sm";

  if (blocks === null) {
    return (
      <section className={cardClass}>
        <div className="flex min-h-[28rem] flex-col items-stretch md:flex-row">
          {stepsSidebar}
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <p className="text-sm text-dashboard-muted">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cardClass}>
      <div className="flex min-h-[28rem] flex-col items-stretch md:flex-row">
        {stepsSidebar}

        {/* Right panel */}
        <div className="flex flex-1 flex-col">
          {step === 1 ? (
            <>
              {/* Step 1 — Header */}
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
                  <p className="text-sm text-dashboard-muted">
                    A block represents a building or property group. Start by
                    adding your first one.
                  </p>
                </div>
              </div>

              {/* Step 1 — Form */}
              <div className="flex flex-1 flex-col gap-4 px-6 py-5 md:px-8 md:py-6">
                <p className="text-xs text-dashboard-muted">
                  You can add more blocks later.
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
                        setSelectedCompanyId(raw ? Number(raw) : null);
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
                        setBlockName(event.target.value);
                        setError(null);
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
                    onClick={() => void handleNextStep1()}
                  >
                    {loading ? "Saving..." : "Next"}
                  </ActionButton>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2 — Header */}
              <div className="flex flex-col gap-4 border-b border-dashboard-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 md:px-8 md:py-6">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-dashboard-muted">
                    Step 2 of 2
                  </p>
                  <h3 className="text-lg font-semibold text-dashboard-text">
                    Add properties
                  </h3>
                  {createdBlock ? (
                    <p className="text-sm text-dashboard-muted">
                      Block:{" "}
                      <span className="font-medium text-dashboard-text">
                        {createdBlock.name}
                      </span>
                    </p>
                  ) : null}
                  <p className="text-sm text-dashboard-muted">
                    Add your first property to the block. You can add more
                    later.
                  </p>
                </div>
              </div>

              {/* Step 2 — Form */}
              <div className="flex flex-1 flex-col gap-4 px-6 py-5 md:px-8 md:py-6">
                <fieldset
                  disabled={propLoading}
                  className="m-0 w-full border-0 p-0 disabled:pointer-events-none disabled:opacity-60 md:max-w-[420px]"
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="property-name"
                        className="text-sm text-dashboard-muted"
                      >
                        Property Name
                      </label>
                      <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                        <FormInput
                          placeholder="Sunset Residency"
                          value={propertyName}
                          onChange={(event) => {
                            setPropertyName(event.target.value);
                            setPropertyNameError(null);
                            clearPropError();
                          }}
                          error={propertyNameError ?? undefined}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="property-comment"
                        className="text-sm text-dashboard-muted"
                      >
                        Comment (Optional)
                      </label>
                      <textarea
                        id="property-comment"
                        value={propertyComment}
                        onChange={(e) => setPropertyComment(e.target.value)}
                        placeholder="Optional note about this property"
                        rows={4}
                        className="w-full resize-y rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
                      />
                    </div>
                  </div>
                </fieldset>

                <FormError message={propApiError ?? undefined} />

                <div className="mt-auto flex justify-end gap-2 pt-2">
                  <ActionButton
                    type="button"
                    variant="neutral"
                    fullWidth
                    className="sm:w-[140px] border-dashboard-border text-dashboard-muted shadow-sm hover:bg-dashboard-hover"
                    disabled={propLoading}
                    onClick={handleGoBack}
                  >
                    ← Back
                  </ActionButton>

                  <ActionButton
                    type="button"
                    variant="neutral"
                    fullWidth
                    className={btnClass}
                    disabled={propLoading}
                    onClick={() => void handleSaveProperty()}
                  >
                    {propLoading ? "Saving..." : "Save Property"}
                  </ActionButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
