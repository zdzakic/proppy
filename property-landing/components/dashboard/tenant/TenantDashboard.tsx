"use client";

/**
 * OwnerDashboard component
 * 
 * Displays the main dashboard interface for property owners.
 * Renders a header and example dashboard card with styling.
 * 
 * @component
 * @returns {JSX.Element} The tenant dashboard layout
 * 
 * @example
 * return <TenantDashboard />
 */
export default function TenantDashboard() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Tenant Dashboard
      </h1>

      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        Example tenant dashboard card
      </div>

    </div>
  );
}