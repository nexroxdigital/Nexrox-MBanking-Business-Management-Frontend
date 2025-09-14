export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "blue",
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
    pink: "from-pink-500 to-pink-600",
  };

  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
      ? "text-red-500"
      : "text-gray-500";

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center ${trendColor} text-sm font-medium`}
          >
            {trend === "up" ? (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17l9.2-9.2M17 17V7H7"
                />
              </svg>
            ) : trend === "down" ? (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 7l-9.2 9.2M7 7v10h10"
                />
              </svg>
            ) : null}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">
          {title}
        </p>
        {subtitle && (
          <p className="text-gray-500 dark:text-gray-400 text-xs">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
