import { useEffect, useState } from 'react';
import axios from '../util/axios';

const Table3 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/dashboard/table3/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Table 3</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tenant</th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.tenant}</td>
              <td>{item.paid ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table3;
