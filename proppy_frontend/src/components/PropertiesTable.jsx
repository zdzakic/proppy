import { useEffect, useState } from 'react';
import axios from '../util/axios';

const PropertiesTable = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('/properties/')
      .then(res => setProperties(res.data))
      .catch(err => console.error('Error fetching properties:', err));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Block ID</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(prop => (
            <tr key={prop.id}>
              <td>{prop.name}</td>
              <td>{prop.block_id}</td>
              <td>{prop.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesTable;
