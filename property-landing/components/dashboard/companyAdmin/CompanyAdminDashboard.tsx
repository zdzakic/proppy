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

import BlocksOverview from "./blocks/BlocksOverview";
import BlocksManager from "./blocks/BlocksManager";


export default function CompanyAdminDashboard() {
return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">
        Company Admin Dashboard
      </h1>

      {/* <BlocksOverview /> */}
      <BlocksManager />

    </div>
  );
}