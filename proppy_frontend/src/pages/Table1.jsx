import { useEffect, useState } from 'react';
import axios from '../util/axios';

const Table1 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/dashboard/table1/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Table 1</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table1;
