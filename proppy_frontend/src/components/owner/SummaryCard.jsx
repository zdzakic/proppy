/**
 * SummaryCard
 * 
 * Reusable card for displaying a dashboard metric.
 * Accepts title, value, optional icon and extra content.
 */

const SummaryCard = ({ title, value, icon = null, extra = null }) => {
    console.log('SummaryCard props:', { title, value }); // 🐞 DEBUG
    
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-md p-6 transition-all">
        <div className="flex items-center justify-between">
          <div>
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
          {icon && <div className="text-primary dark:text-white">{icon}</div>}
        </div>
      </div>
    );
  };
  
  export default SummaryCard;
  