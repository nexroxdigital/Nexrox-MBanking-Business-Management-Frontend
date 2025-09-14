"use client";

import { useState } from "react";

const ProfitLossHeader = ({ onPeriodChange, onExport, onPrint }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const periods = [
    { value: "daily", label: "Daily", icon: "📅" },
    { value: "weekly", label: "Weekly", icon: "📊" },
    { value: "monthly", label: "Monthly", icon: "📈" },
    { value: "custom", label: "Custom Range", icon: "🗓️" },
  ];

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    onPeriodChange(period);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Profit & Loss Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive business insights and financial analytics
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Period Selector */}
          <div className="flex bg-gray-100/50 dark:bg-gray-800/50 rounded-xl p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  selectedPeriod === period.value
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <span>{period.icon}</span>
                <span>{period.label}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Export</span>
            </button>
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {selectedPeriod === "custom" && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitLossHeader;
