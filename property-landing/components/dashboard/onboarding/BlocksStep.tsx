"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import ActionButton from "@/components/ui/ActionButton";
import FormInput from "@/components/ui/FormInput";
import apiClient from "@/utils/api/apiClient";
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
  const [blockName, setBlockName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** `null` until the first blocks/companies fetch finishes (initial load). */
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );

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

  const handleAddBlock = async () => {
    const name = blockName.trim();
    if (!name) return;

    if (companies.length > 1 && !selectedCompanyId) {
      setError("Please select a company.");
      return;
    }

    if (!selectedCompanyId) {
      setError("Company is not ready yet.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await apiClient.post<Block>("/properties/blocks/", {
        name,
        company: selectedCompanyId,
      });

      setBlocks((prev) => [...(prev ?? []), res.data]);
      setBlockName("");
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
    } finally {
      setLoading(false);
    }
  };

  const showCompanySelect = companies.length > 1;
  const blockList = blocks ?? [];

  const addDisabled =
    !blockName.trim() ||
    loading ||
    (showCompanySelect && !selectedCompanyId) ||
    !selectedCompanyId;

  const selectedCompany =
    companies.find((c) => c.id === selectedCompanyId) ?? null;

  // Identical classes for both action buttons
  const btnClass =
    "w-full shrink-0 border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover sm:w-36";

  // Steps panel — bg-dashboard-sidebar is always dark, text is always white-toned
  const stepsSidebar = (
    <aside
      aria-label="Setup steps"
      className="flex w-full shrink-0 flex-col border-b border-dashboard-border bg-dashboard-sidebar px-5 py-8 md:w-[220px] md:border-b-0 md:border-r md:border-r-dashboard-border md:py-8"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
        Setup
      </p>

      <nav className="relative mt-7 flex flex-col" aria-label="Onboarding steps">
        {/* Vertical connector */}
        <div className="absolute left-[17px] top-10 h-[calc(100%-40px)] w-px bg-white/10" />

        {/* Step 1 — active */}
        <div className="flex items-start gap-3">
          <div className="relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-dashboard-sidebar shadow-sm">
            1
          </div>
          <div className="py-1">
            <p className="text-sm font-semibold text-white">Add Block</p>
            <p className="mt-0.5 text-xs text-white/50">Add your first block</p>
          </div>
        </div>

        {/* Step 2 — inactive */}
        <div className="mt-7 flex items-start gap-3">
          <div className="relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm font-medium text-white/30">
            2
          </div>
          <div className="py-1">
            <p className="text-sm font-medium text-white/40">Add Properties</p>
            <p className="mt-0.5 text-xs text-white/25">Manage your units</p>
          </div>
        </div>
      </nav>
    </aside>
  );

  // Inline <section> instead of DashboardSectionCard to avoid Tailwind v4 p-6/p-0 conflict.
  // overflow-hidden + rounded-2xl clips the sidebar bg to the card's rounded corners.
  const cardClass =
    "overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-surface shadow-sm";

  if (blocks === null) {
    return (
      <section className={cardClass}>
        <div className="flex min-h-[28rem] flex-col md:flex-row">
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
      <div className="flex min-h-[28rem] flex-col md:flex-row">
        {stepsSidebar}

        {/* Right panel */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
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
                A block represents a building or property group. Start by adding
                your first one.
              </p>
            </div>
            <ActionButton
              type="button"
              variant="neutral"
              className={btnClass}
              disabled={addDisabled}
              onClick={() => void handleAddBlock()}
            >
              <Plus size={14} />
              {loading ? "Saving..." : "Add block"}
            </ActionButton>
          </div>

          {/* Form area */}
          <div className="flex flex-1 flex-col gap-4 px-6 py-5 md:px-8 md:py-6">
            <p className="text-xs text-dashboard-muted">
              You can add more blocks later.
            </p>

            {showCompanySelect ? (
              <div className="w-full space-y-1 md:w-1/2">
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

            {/* Input — full width on mobile, 50% on desktop */}
            <fieldset
              disabled={loading}
              className="m-0 w-full border-0 p-0 disabled:pointer-events-none disabled:opacity-60 md:w-1/2"
            >
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="Block name"
                  value={blockName}
                  onChange={(event) => setBlockName(event.target.value)}
                  autoComplete="off"
                />
              </div>
            </fieldset>

            {error ? (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            ) : null}

            {blockList.length > 0 ? (
              <ul className="w-full space-y-1 rounded-lg border border-dashboard-border p-3 md:w-1/2">
                {blockList.map((block) => (
                  <li key={block.id} className="text-sm text-dashboard-text">
                    {block.name}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-auto flex justify-end pt-2">
              <ActionButton
                type="button"
                variant="neutral"
                className={`${btnClass} disabled:opacity-50`}
                disabled={blockList.length === 0 || loading}
                onClick={() =>
                  router.push(ROUTES.DASHBOARD_PAGES.COMPANY_ADMIN.PROPERTIES)
                }
              >
                Next
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
