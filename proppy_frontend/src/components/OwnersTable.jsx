import { useEffect, useState } from 'react';
import axios from '../util/axios';

const OwnersTable = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    axios
      .get('/properties/owners/')
      .then((res) => setOwners(res.data))
      .catch((err) => console.error('Error fetching owners:', err));
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">Owners</h1>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-grayText dark:text-gray-300 uppercase text-xs">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Flats</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr
                key={owner.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{owner.name}</td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{owner.email}</td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{owner.phone}</td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {owner.properties.map((p) => p.name).join(', ')}
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
