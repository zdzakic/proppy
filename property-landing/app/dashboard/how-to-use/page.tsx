"use client";

import { Building2, Home, PencilLine, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import DashboardSectionCard from "@/components/dashboard/shared/common/DashboardSectionCard";

type DetailItem = {
  label: string;
  value: string;
};

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  details: DetailItem[];
};

function StepCard({ step, title, description, icon, details }: StepCardProps) {
  const Icon = icon;

  return (
    <DashboardSectionCard
      title={String(step)}
      titleClassName="text-4xl font-bold leading-none"
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Icon className="mt-0.5 h-4 w-4 text-dashboard-muted" />
          <div>
            <h3 className="text-base font-semibold text-dashboard-text">{title}</h3>
            <p className="text-sm text-dashboard-muted">{description}</p>
          </div>
        </div>

        <div className="grid gap-2">
          {details.map((item) => (
            <div
              key={`${title}-${item.label}`}
              className="rounded-lg border border-dashboard-border bg-dashboard-bg/60 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-[0.12em] text-dashboard-muted">
                {item.label}
              </p>
              <p className="text-sm text-dashboard-text">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export default function DashboardHowToUsePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-dashboard-border bg-dashboard-surface p-6 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-dashboard-muted">
            Help
          </p>
          <p className="max-w-2xl text-sm leading-6 text-dashboard-muted">
            Quick guide for company admins: create and manage blocks, then add and maintain
            properties inside each block.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <StepCard
          step={1}
          icon={Building2}
          title="Add a Block"
          description="Use this when creating a new building section or entrance."
          details={[
            { label: "Where", value: "Dashboard > Add Block" },
            { label: "Required", value: "Block name" },
            { label: "Result", value: "Block appears in Blocks table" },
          ]}
        />

        <StepCard
          step={2}
          icon={Home}
          title="Add Properties"
          description="Add apartments or units to the selected block."
          details={[
            { label: "Where", value: "Block row action or Block Details" },
            { label: "Required", value: "Property name" },
            { label: "Optional", value: "Comment" },
          ]}
        />

        <StepCard
          step={3}
          icon={PencilLine}
          title="Update Block or Property"
          description="Keep names and comments accurate as structure changes."
          details={[
            { label: "Block update", value: "Use edit icon in Blocks table" },
            { label: "Property update", value: "Open property edit modal" },
          ]}
        />

        <StepCard
          step={4}
          icon={Trash2}
          title="Delete Carefully"
          description="Delete removes data immediately after confirmation."
          details={[
            { label: "Delete block", value: "Removes block and related properties" },
            { label: "Delete property", value: "Removes only selected property" },
          ]}
        />
      </div>
    </div>
  );
}
