import { useEffect, useState } from 'react';
import axios from '../../util/axios';

const PropertiesTable = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios
      .get('/properties/')
      .then((res) => setProperties(res.data))
      .catch((err) => console.error('Error fetching properties:', err));
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">Properties</h1>
      <div className="overflow-x-auto">
        <table className="table w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-grayText dark:text-gray-300 uppercase text-xs">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Block ID</th>
              <th className="py-3 px-4 text-left">Block Name</th>
              <th className="py-3 px-4 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr
                key={prop.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{prop.id}</td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{prop.name}</td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{prop.block}</td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{prop.block_name}</td>
                <td className="py-2 px-4 text-grayText dark:text-gray-200">{prop.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PropertiesTable;
