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


export default function DashboardPage() {

  const { user } = useAuth();

  

  /**
   * ako nema usera (nije logovan)
   */
  if (!user) {
    return <div>No user found</div>;
  }

  /**
   * OWNER
   */
  if (user.role === "owner") {
    return <OwnerDashboard />;
  }

  /**
   * TENANT
   */
  if (user.role === "tenant") {
    return <TenantDashboard />;
  }

  /**
   * fallback
   */
  return <div>Unsupported role</div>;
}