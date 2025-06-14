import { FaCheckCircle, FaBuilding, FaChartLine } from "react-icons/fa";

const features = [
  {
    icon: <FaBuilding className="text-primary text-3xl mb-4" />,
    title: "Easy Portfolio Management",
    description: "Quickly track and manage all your properties in one clean dashboard.",
  },
  {
    icon: <FaChartLine className="text-primary text-3xl mb-4" />,
    title: "Insightful Analytics",
    description: "Understand property performance and trends with clear visuals.",
  },
  {
    icon: <FaCheckCircle className="text-primary text-3xl mb-4" />,
    title: "Smart Ownership Tracking",
    description: "See who owns what with full clarity on ownership structures.",
  },
];

const LandingFeatures = () => {
  return (
    <section className="bg-light dark:bg-[#0e1625] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-white mb-12">
          What Proppy Offers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#1a2538] rounded-2xl shadow-sm hover:shadow-lg transition p-6 md:p-8 text-center"
            >
              {feat.icon}
              <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-grayText dark:text-gray-400">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
