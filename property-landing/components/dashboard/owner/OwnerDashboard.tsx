/**
 * Path: components/dashboard/owner/OwnerDashboard.tsx
 *
 * OWNER DASHBOARD PAGE
 *
 * Šta radi:
 * - Prikazuje osnovni dashboard za owner korisnika
 *
 * Zašto postoji:
 * - Owner ima specifičan pogled na sistem
 *
 * Koji problem rješava:
 * - Grupira owner funkcionalnosti na jednom mjestu
 *
 * Napomena:
 * - Za sada prikazuje placeholder kartice
 * - Kasnije će sadržati:
 *   - property pregled
 *   - finansije
 *   - works status
 */

export default function OwnerDashboard() {
  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-brand-accent">
        Owner Dashboard
      </h1>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
          Properties
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
          Works
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
          Finances
        </div>

      </div>

    </div>
  );
}