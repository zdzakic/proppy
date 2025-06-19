const Dashboard = () => {
  const cards = [
    {
      title: 'Total Properties',
      value: 134,
    },
    {
      title: 'Total Rent Collected',
      value: '$8,500',
    },
    {
      title: 'Pending Maintenance',
      value: 3,
    },
  ];

  return (
    <section className="py-6 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-primary dark:text-white">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white dark:bg-gray-900 shadow-md p-6 transition-all"
          >
            <h2 className="text-md font-medium text-gray-500 dark:text-gray-400 mb-1">
              {card.title}
            </h2>
            <p className="text-3xl font-semibold text-primary dark:text-white">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
