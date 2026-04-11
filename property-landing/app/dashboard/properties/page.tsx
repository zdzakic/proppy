"use client";

import { useAuth } from "@/context/AuthContext";
import OwnerDashboard from "@/components/dashboard/owner/OwnerDashboard";
import TenantDashboard from "@/components/dashboard/tenant/TenantDashboard";
import CompanyAdminDashboard from "@/components/dashboard/companyAdmin/CompanyAdminDashboard";

export default function DashboardPropertiesPage() {
  const { user } = useAuth();

  if (!user) return <div>No user found</div>;

  if (user.roles?.includes("COMPANYADMIN")) {
    return <CompanyAdminDashboard />;
  }

  if (user.roles?.includes("OWNER")) {
    return <OwnerDashboard />;
  }

  if (user.roles?.includes("TENANT")) {
    return <TenantDashboard />;
  }

  return <div>Unsupported role</div>;
}
