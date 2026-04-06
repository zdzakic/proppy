/**
 * Company Admin Dashboard
 *
 * ZAŠTO:
 * - glavni ekran za upravljanje firmom
 * - ovdje ide:
 *   - blokovi
 *   - stanovi
 */

export default function CompanyAdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-xl">
          Blocks (coming soon)
        </div>

        <div className="p-4 border rounded-xl">
          Properties (coming soon)
        </div>
      </div>
    </div>
  );
}