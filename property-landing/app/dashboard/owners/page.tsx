"use client";

import { useAuth } from "@/context/AuthContext";

/**
 * DashboardOwnersPage
 *
 * What it does: Renders the Owners dashboard section (placeholder).
 * Why it exists: Adds a dedicated entry point for company admins to manage owners.
 * What would break if removed: The sidebar "Owners" link would lead to a missing page (404).
 */
export default function DashboardOwnersPage() {
  const { user } = useAuth();

  if (!user) return <div>No user found</div>;

  if (!user.roles?.includes("COMPANYADMIN")) {
    return (
      <div className="rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 text-sm text-dashboard-muted sm:p-6">
        Owners section is available for company admins only.
      </div>
    );
  }

  return (
    <section className="space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold text-dashboard-text">Owners</h1>
        <p className="text-xs text-dashboard-muted">Manage property owners</p>
      </div>
    </section>
  );
}

