"use client";

import {
  BadgeCheck,
  Building2,
  Mail,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import DashboardInfoRow from "@/components/dashboard/shared/common/DashboardInfoRow";
import DashboardSectionCard from "@/components/dashboard/shared/common/DashboardSectionCard";
import { getPrimaryRole, type AppRole } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/context/AuthContext";
import ActionButton from "@/components/ui/ActionButton";
import Spinner from "@/components/ui/Spinner";

const roleDetails: Record<
  AppRole,
  {
    label: string;
    summary: string;
    capabilities: string[];
  }
> = {
  COMPANYADMIN: {
    label: "Company Admin",
    summary: "Manages company-wide structure, blocks and operational access.",
    capabilities: [
      "Company dashboard access",
      "Block management overview",
      "Administrative settings access",
    ],
  },
  OWNER: {
    label: "Owner",
    summary: "Focused on owned properties, tenants and account-level actions.",
    capabilities: [
      "Property overview access",
      "Tenant relationship view",
      "Owner account settings",
    ],
  },
  TENANT: {
    label: "Tenant",
    summary: "Focused on account visibility and personal dashboard settings.",
    capabilities: [
      "Tenant dashboard access",
      "Profile overview",
      "Personal settings access",
    ],
  },
};

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashboard-border bg-dashboard-surface">
        <Spinner className="border-dashboard-border border-t-dashboard-text" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const primaryRole = getPrimaryRole(user.roles);
  const roleInfo = roleDetails[primaryRole];
  const email = user.email ?? "No email available";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-dashboard-border bg-dashboard-surface p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dashboard-hover text-lg font-semibold text-dashboard-text">
              {initials}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-dashboard-muted">
                  Profile
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-dashboard-text">
                  Account Overview
                </h1>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-dashboard-muted">
                Central place for account identity, active role and quick access to
                personal dashboard settings.
              </p>

              <div className="inline-flex items-center gap-2 rounded-full border border-dashboard-border bg-dashboard-bg px-3 py-1 text-xs font-medium text-dashboard-text">
                <BadgeCheck className="h-4 w-4 text-dashboard-accent" />
                {roleInfo.label}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton
              variant="primary"
              onClick={() => router.push(ROUTES.DASHBOARD_PAGES.SETTINGS)}
            >
              Open Settings
            </ActionButton>
            <ActionButton
              variant="neutral"
              onClick={() => router.push(ROUTES.DASHBOARD)}
            >
              Back to Dashboard
            </ActionButton>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardSectionCard
          icon={UserCircle2}
          title="Account Details"
          description="Basic identity data currently available in the app session."
          contentClassName="space-y-3"
        >
          <DashboardInfoRow label="Email" value={email} />
          <DashboardInfoRow label="User ID" value={String(user.id)} />
          <DashboardInfoRow label="Primary Role" value={roleInfo.label} />
          <DashboardInfoRow label="Session Status" value="Authenticated" />
        </DashboardSectionCard>

        <div className="space-y-6">
          <DashboardSectionCard
            icon={ShieldCheck}
            title="Access Scope"
            description="Current dashboard access based on your active role."
          >
            <p className="text-sm leading-6 text-dashboard-muted">
              {roleInfo.summary}
            </p>

            <ul className="mt-4 space-y-3">
              {roleInfo.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex items-start gap-3 rounded-xl border border-dashboard-border bg-dashboard-bg/60 px-4 py-3 text-sm text-dashboard-text"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-dashboard-accent" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </DashboardSectionCard>

          <DashboardSectionCard
            icon={Building2}
            title="Active Roles"
            description="All roles currently attached to your account."
          >
            <div className="flex flex-wrap gap-2">
              {(user.roles ?? []).map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-dashboard-border bg-dashboard-hover px-3 py-1 text-xs font-medium tracking-wide text-dashboard-text"
                >
                  {role}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-dashboard-border bg-dashboard-bg/60 p-4">
              <div className="flex items-center gap-3 text-sm text-dashboard-text">
                <Mail className="h-4 w-4 text-dashboard-muted" />
                Login identity is currently based on the stored email address.
              </div>
            </div>
          </DashboardSectionCard>
        </div>
      </div>
    </div>
  );
}