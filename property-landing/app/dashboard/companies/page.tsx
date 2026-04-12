"use client";

import CompaniesManager from "@/components/dashboard/companyAdmin/companies/CompaniesManager";
import { useAuth } from "@/context/AuthContext";

export default function DashboardCompaniesPage() {
  const { user } = useAuth();

  if (!user) return <div>No user found</div>;

  if (user.roles?.includes("COMPANYADMIN")) {
    return <CompaniesManager />;
  }

  return (
    <div className="rounded-xl border border-dashboard-border bg-dashboard-surface p-4 text-sm text-dashboard-muted">
      Companies section is available for company admins only.
    </div>
  );
}
