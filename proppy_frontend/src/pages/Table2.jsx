import { useEffect, useState } from 'react';
import axios from '../util/axios';

const Table2 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/dashboard/table2/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Table 2</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table2;
