const TopCustomers = () => {
  const topCustomers = [
    {
      name: "Ahmed Hassan",
      totalProfit: 15420,
      transactions: 45,
      avgProfit: 342,
      trend: "up",
      avatar: "AH",
      companyBreakdown: {
        bkash: 8500,
        rocket: 4200,
        nagad: 2720,
      },
      monthlyGrowth: 12.5,
    },
    {
      name: "Fatima Khan",
      totalProfit: 12850,
      transactions: 38,
      avgProfit: 338,
      trend: "up",
      avatar: "FK",
      companyBreakdown: {
        bkash: 6800,
        rocket: 3950,
        nagad: 2100,
      },
      monthlyGrowth: 8.3,
    },
    {
      name: "Mohammad Ali",
      totalProfit: 11200,
      transactions: 42,
      avgProfit: 267,
      trend: "down",
      avatar: "MA",
      companyBreakdown: {
        bkash: 5600,
        rocket: 3200,
        nagad: 2400,
      },
      monthlyGrowth: -3.2,
    },
    {
      name: "Rashida Begum",
      totalProfit: 9800,
      transactions: 35,
      avgProfit: 280,
      trend: "up",
      avatar: "RB",
      companyBreakdown: {
        bkash: 4900,
        rocket: 2800,
        nagad: 2100,
      },
      monthlyGrowth: 15.7,
    },
    {
      name: "Karim Sheikh",
      totalProfit: 8950,
      transactions: 29,
      avgProfit: 309,
      trend: "up",
      avatar: "KS",
      companyBreakdown: {
        bkash: 4200,
        rocket: 2950,
        nagad: 1800,
      },
      monthlyGrowth: 6.8,
    },
    {
      name: "Nasir Ahmed",
      totalProfit: 7600,
      transactions: 31,
      avgProfit: 245,
      trend: "down",
      avatar: "NA",
      companyBreakdown: {
        bkash: 3800,
        rocket: 2200,
        nagad: 1600,
      },
      monthlyGrowth: -1.5,
    },
  ];

  const lossTracking = [
    {
      type: "Wrong Cash Given",
      amount: 2500,
      incidents: 5,
      color: "bg-red-500",
    },
    {
      type: "Customer Didn't Pay",
      amount: 1800,
      incidents: 3,
      color: "bg-orange-500",
    },
    { type: "System Error", amount: 950, incidents: 2, color: "bg-yellow-500" },
    { type: "Refunds", amount: 650, incidents: 4, color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Top Customers */}
      <div className="xl:col-span-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Earning Customers
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Customers generating highest profits with detailed breakdown
            </p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
            View All
          </button>
        </div>
        <div className="space-y-6">
          {topCustomers.map((customer, index) => (
            <div
              key={index}
              className="p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 border border-gray-200/30 dark:border-gray-700/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {customer.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {customer.name}
                    </h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{customer.transactions} transactions</span>
                      <span>•</span>
                      <span>Avg: ৳{customer.avgProfit}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white">
                      ৳{customer.totalProfit.toLocaleString()}
                    </span>
                    <div
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        customer.trend === "up"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 ${
                          customer.trend === "up" ? "rotate-0" : "rotate-180"
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
                      <span>{Math.abs(customer.monthlyGrowth)}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly growth
                  </p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Earnings by Company
                </h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">bK</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ৳{customer.companyBreakdown.bkash.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      bKash
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">R</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ৳{customer.companyBreakdown.rocket.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Rocket
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">N</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ৳{customer.companyBreakdown.nagad.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Nagad
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loss Tracking */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Loss Tracking
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Recent losses and incidents
          </p>
        </div>
        <div className="space-y-4">
          {lossTracking.map((loss, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${loss.color}`}></div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {loss.type}
                  </span>
                </div>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                  {loss.incidents} incidents
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-red-600 dark:text-red-400">
                  -৳{loss.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                Total Losses
              </span>
              <span className="font-bold text-red-600 dark:text-red-400 text-lg">
                -৳
                {lossTracking
                  .reduce((sum, loss) => sum + loss.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCustomers;
