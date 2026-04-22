"use client";

import { useAuth } from "@/context/AuthContext";
import OwnersManager from "@/components/dashboard/companyAdmin/owners/OwnersManager";

/**
 * DashboardOwnersPage
 *
 * What it does: Entry point for the /dashboard/owners route — guards by role then renders OwnersManager.
 * Why it exists: Matches the Blocks page pattern: page = auth guard + manager component.
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

  return <OwnersManager />;
}
