import { useEffect, useState } from 'react';
import axios from '../../util/axios';
import SummaryCard from '../../components/owner/SummaryCard'; // reuse za sada

/**
 * TenantDashboard
 *
 * Displays summary metrics for tenants.
 * Fetches data from /dashboard/tenant/summary/ using axios.
 * Modular and extendable for future metrics like payments, documents, etc.
 */

const SUMMARY_API_URL = '/dashboard/tenant/summary/';

const TenantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(SUMMARY_API_URL)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tenant summary:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-6 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-primary dark:text-white">
        {stats?.tenant_name ? `Welcome ${stats.tenant_name} – Tenant Dashboard` : 'Tenant Dashboard'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading && <p className="text-gray-500">Loading...</p>}

        {stats && (
          <>
            <SummaryCard title="My Properties" value={stats.total_properties} />
            <SummaryCard title="Rent Paid" value={`£${stats.rent_paid}`} />
            <SummaryCard title="Open Requests" value={stats.open_maintenance_requests} />
          </>
        )}
      </div>
    </section>
  );
};

export default TenantDashboard;
