/**
 * Company Admin Dashboard
 *
 * ZAŠTO:
 * - glavni ekran za upravljanje firmom
 * - ovdje ide:
 *   - blokovi
 *   - nekretnine
 *   - korisnici
 */

import BlocksManager from "./blocks/BlocksManager";

export default function CompanyAdminDashboard() {
  return (
    <div className="space-y-6">
      <BlocksManager />
    </div>
  );
}