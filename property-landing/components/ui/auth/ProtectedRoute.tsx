"use client";

/**
 * Feature: Protected dashboard route
 *
 * Šta radi:
 * - čeka auth provjeru
 * - ako nema usera, radi redirect na /login
 * - ako auth još traje, prikazuje spinner
 *
 * Zašto ovako:
 * - dashboard layout je pravo mjesto za modul-level loading
 * - izbjegava prazan ekran dok traje auth restore
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

   /**
   * Dok traje auth restore
   * ništa ne renderujemo
   */
   if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dashboard-bg">
        <Spinner />
      </div>
    );
  }

    /**
   * Ako nema usera
   * redirect ide iz useEffect
   */
  if (!user) return null;

  return <>{children}</>;
}