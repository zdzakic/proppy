import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen w-64 bg-base-200 p-4">
      <div className="mb-8 text-lg font-bold">Proppy Dashboard</div>
      <Link to="/dashboard" className="btn btn-ghost justify-start">Dashboard</Link>
      <Link to="/table1" className="btn btn-ghost justify-start">Table 1</Link>
      <Link to="/table2" className="btn btn-ghost justify-start">Table 2</Link>
      <Link to="/table3" className="btn btn-ghost justify-start">Table 3</Link>
    </div>
  );
};

export default Sidebar;
