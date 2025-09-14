"use client";

const ProfitSummaryCards = () => {
  const summaryData = [
    {
      title: "Total Revenue",
      amount: "৳1,25,450",
      change: "+12.5%",
      trend: "up",
      icon: "💰",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Expenses",
      amount: "৳45,230",
      change: "+5.2%",
      trend: "up",
      icon: "💸",
      gradient: "from-red-500 to-rose-600",
    },
    {
      title: "Net Profit",
      amount: "৳80,220",
      change: "+18.7%",
      trend: "up",
      icon: "📈",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Profit Margin",
      amount: "64.1%",
      change: "+3.2%",
      trend: "up",
      icon: "📊",
      gradient: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              {item.icon}
            </div>
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                item.trend === "up"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}
            >
              <svg
                className={`w-3 h-3 ${
                  item.trend === "up" ? "rotate-0" : "rotate-180"
                }`}
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
              <span>{item.change}</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {item.amount}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfitSummaryCards;
