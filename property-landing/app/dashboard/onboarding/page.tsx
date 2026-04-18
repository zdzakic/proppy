"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import BlocksStep from "@/components/dashboard/onboarding/BlocksStep";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/routes";

export default function DashboardOnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.roles?.includes("COMPANYADMIN")) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, router]);

  if (!user) {
    return <p className="text-sm text-dashboard-muted">Loading...</p>;
  }

  if (!user.roles?.includes("COMPANYADMIN")) {
    return null;
  }

  return <BlocksStep />;
}
