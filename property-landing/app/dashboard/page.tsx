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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import CompaniesManager from "@/components/dashboard/companyAdmin/companies/CompaniesManager";
import OwnerDashboard from "@/components/dashboard/owner/OwnerDashboard";
import TenantDashboard from "@/components/dashboard/tenant/TenantDashboard";
import apiClient from "@/utils/api/apiClient";

function CompanyAdminHome() {
  const router = useRouter();
  const [checkingBlocks, setCheckingBlocks] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await apiClient.get("/properties/blocks/");
        const blocks = Array.isArray(res.data) ? res.data : [];
        if (cancelled) return;
        if (blocks.length === 0) {
          router.replace("/dashboard/onboarding");
          return;
        }
      } catch {
        // Allow dashboard if the check fails.
      }
      if (!cancelled) setCheckingBlocks(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingBlocks) {
    return <p className="text-sm text-dashboard-muted">Loading...</p>;
  }

  return <CompaniesManager />;
}

export default function DashboardPage() {
  const { user } = useAuth();


  if (!user) return <div>No user found</div>;

  /**
   * 🔴 COMPANY ADMIN (PRVI!)
   */
  if (user.roles?.includes("COMPANYADMIN")) {
    return <CompanyAdminHome />;
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