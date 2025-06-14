import { useEffect, useState } from 'react';
import axios from '../util/axios';

const OwnershipsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/properties/ownerships/')
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching ownerships:", err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ownerships</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Owner Name</th>
            <th>Email</th>
            <th>Flat Name</th>
            <th>Block ID</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.owner_name}</td>
              <td>{entry.owner_email}</td>
              <td>{entry.property_name}</td>
              <td>{entry.block_id}</td>
              <td>{entry.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnershipsTable;
