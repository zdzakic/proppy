"use client";

/**
 * Path: app/dashboard/page.tsx
 *
 * ROLE BASED DASHBOARD RENDER
 *
 * Šta radi:
 * - čita user iz AuthContext
 * - renderuje Owner ili Tenant dashboard
 *
 * Zašto ovako:
 * - owner i tenant koriste isti layout
 * - razlikuje se samo sadržaj dashboarda
 *
 * Šta rješava:
 * - jednostavna role separacija bez novog routing sistema
 */

import { useAuth } from "@/context/AuthContext";
import OwnerDashboard from "@/components/dashboard/owner/OwnerDashboard";
import TenantDashboard from "@/components/dashboard/tenant/TenantDashboard";
import CompanyAdminDashboard from "@/components/dashboard/companyAdmin/CompanyAdminDashboard";


export default function DashboardPage() {
  const { user } = useAuth();


  if (!user) return <div>No user found</div>;

  /**
   * 🔴 COMPANY ADMIN (PRVI!)
   */
  if (user.roles?.includes("COMPANYADMIN")) {
    return <CompanyAdminDashboard />;
  }

  /**
   * OWNER
   */
  if (user.roles?.includes("OWNER")) {
    return <OwnerDashboard />;
  }

  /**
   * TENANT
   */
  if (user.roles?.includes("TENANT")) {
    return <TenantDashboard />;
  }

  return <div>Unsupported role</div>;
}