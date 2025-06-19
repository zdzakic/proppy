/**
 * SummaryCard
 * 
 * Reusable card for displaying a dashboard metric.
 * Fully centered layout: all elements are centered within the card.
 */

const SummaryCard = ({ title, value, icon = null, extra = null }) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-md p-6 transition-all flex flex-col items-center justify-center text-center">
      {icon && <div className="mb-2 text-primary dark:text-white">{icon}</div>}

      <h2 className="text-md font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </h2>

      <p className="text-3xl font-semibold text-primary dark:text-white">
        {value}
      </p>

      {extra && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{extra}</p>
      )}
    </div>
  );
};

export default SummaryCard;
