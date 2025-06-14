const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow p-6">
          <h2 className="text-xl font-bold mb-2">Total Properties</h2>
          <p className="text-3xl">12</p>
        </div>
        <div className="card bg-base-100 shadow p-6">
          <h2 className="text-xl font-bold mb-2">Total Rent Collected</h2>
          <p className="text-3xl">$8,500</p>
        </div>
        <div className="card bg-base-100 shadow p-6">
          <h2 className="text-xl font-bold mb-2">Pending Maintenance</h2>
          <p className="text-3xl">3</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
