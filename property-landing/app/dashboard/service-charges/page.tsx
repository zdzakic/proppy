"use client";

import { useAuth } from "@/context/AuthContext";

/**
 * DashboardServiceChargesPage
 *
 * What it does: Placeholder page for /dashboard/service-charges.
 * Why it exists: Reserves the route and navigation entry while the feature is being built.
 * What would break if removed: The sidebar link would 404 and we couldn't iterate on the UI incrementally.
 */
export default function DashboardServiceChargesPage() {
  const { user } = useAuth();

  if (!user) return <div>No user found</div>;

  if (!user.roles?.includes("COMPANYADMIN")) {
    return (
      <div className="rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 text-sm text-dashboard-muted sm:p-6">
        Service Charges section is available for company admins only.
      </div>
    );
  }

  return (
    <section className="space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold text-dashboard-text">Service Charges</h1>
        <p className="text-xs text-dashboard-muted">Coming soon.</p>
      </div>
    </section>
  );
}

