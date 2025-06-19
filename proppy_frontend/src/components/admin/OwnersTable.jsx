import { useEffect, useState } from 'react';
import axios from '../../util/axios';
import { sortTableData } from '../../util/tableUtils';
import { ChevronUp, ChevronDown } from 'lucide-react';

const OwnersTable = () => {
  const [owners, setOwners] = useState([]);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    axios
      .get('/properties/owners/')
      .then((res) => setOwners(res.data))
      .catch((err) => console.error('Error fetching owners:', err));
  }, []);

  // Handle column sorting
  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Add 'flats' key for sorting derived data
  const ownersWithFlatsKey = owners.map((owner) => ({
    ...owner,
    flats: owner.properties?.map((p) => p.name).join(', ') || ''
  }));

  const sortedOwners = sortKey
    ? sortTableData(ownersWithFlatsKey, sortKey, sortDirection)
    : ownersWithFlatsKey;

  // Render sort icon for active column
  const renderSortIcon = (key) => {
    const isActive = sortKey === key;
    const opacityClass = isActive ? 'opacity-100 text-primary' : 'opacity-20';
    const Icon = sortDirection === 'asc' ? ChevronUp : ChevronDown;
  
    return <Icon size={14} className={`inline ml-1 ${opacityClass}`} />;
  };

  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">Owners</h1>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-grayText dark:text-gray-300 uppercase text-xs">
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {renderSortIcon('name')}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email {renderSortIcon('email')}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort('phone')}
              >
                Phone {renderSortIcon('phone')}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort('flats')}
              >
                Flats {renderSortIcon('flats')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOwners.map((owner) => (
              <tr
                key={owner.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {owner.name}
                </td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {owner.email}
                </td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {owner.phone}
                </td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {owner.flats || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OwnersTable;
