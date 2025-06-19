import { useEffect, useState } from 'react';
import SummaryCard from '../../components/owner/SummaryCard';
import axios from '../../util/axios';

/**
 * OwnerDashboard
 *
 * Displays key owner metrics using SummaryCard components.
 * Fetches data from /dashboard/owner/summary/ API endpoint using axios.
 * Modular, scalable, and ready for expansion with additional cards.
 */

// Define API endpoint explicitly for clarity and reusability
const SUMMARY_API_URL = '/dashboard/owner/summary/';

const OwnerDashboard = () => {
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
        console.error('Error fetching owner summary:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-6 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-primary dark:text-white">
      {stats?.owner_name ? `Welcome ${stats.owner_name} – Owner Dashboard` : 'Owner Dashboard'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading && <p className="text-gray-500">Loading...</p>}

        {stats && (
          <>
            <SummaryCard title="Total Properties" value={stats.total_properties} />
            <SummaryCard title="Companies" value={stats.companies_count} />
            <SummaryCard title="Blocks" value={stats.blocks_count} />
          </>
        )}
      </div>
    </section>
  );
};

export default OwnerDashboard;
