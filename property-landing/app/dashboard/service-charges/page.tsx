"use client";

import { useAuth } from "@/context/AuthContext";
import ServiceChargesManager from "@/components/dashboard/companyAdmin/billing/ServiceChargesManager";

/**
 * DashboardServiceChargesPage
 *
 * What it does: Entry point for /dashboard/service-charges — guards by role then renders ServiceChargesManager.
 * Why it exists: Matches the Owners page pattern: page = auth guard + manager component.
 * What would break if removed: The sidebar "Service Charges" link would lead to a 404.
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

  return <ServiceChargesManager />;
}

