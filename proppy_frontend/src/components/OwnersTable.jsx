import { useEffect, useState } from 'react';
import axios from '../util/axios';

const OwnersTable = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    axios.get('/properties/owners/')
      .then(res => setOwners(res.data))
      .catch(err => console.error('Error fetching owners:', err));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Flats</th>
          </tr>
        </thead>
        <tbody>
          {owners.map(owner => (
            <tr key={owner.id}>
              <td>{owner.name}</td>
              <td>{owner.email}</td>
              <td>{owner.phone}</td>
              <td>
                {owner.properties.map(p => p.name).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnersTable;
