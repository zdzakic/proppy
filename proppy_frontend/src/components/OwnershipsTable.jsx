import { useEffect, useState } from 'react';
import axios from '../util/axios';

const OwnershipsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('/properties/ownerships/')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error fetching ownerships:', err));
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        Ownerships
      </h1>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-grayText dark:text-gray-300 uppercase text-xs">
              <th className="py-3 px-4 text-left">Owner Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Flat Name</th>
              <th className="py-3 px-4 text-left">Block ID</th>
              <th className="py-3 px-4 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {entry.owner_name}
                </td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {entry.owner_email}
                </td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {entry.property_name}
                </td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {entry.block_id}
                </td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">
                  {entry.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OwnershipsTable;
