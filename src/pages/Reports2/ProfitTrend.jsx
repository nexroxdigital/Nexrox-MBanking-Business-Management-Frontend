"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ProfitTrendChart = () => {
  const data = [
    { month: "Jan", profit: 45000, revenue: 85000, expenses: 40000 },
    { month: "Feb", profit: 52000, revenue: 92000, expenses: 40000 },
    { month: "Mar", profit: 48000, revenue: 88000, expenses: 40000 },
    { month: "Apr", profit: 61000, revenue: 105000, expenses: 44000 },
    { month: "May", profit: 55000, revenue: 98000, expenses: 43000 },
    { month: "Jun", profit: 67000, revenue: 115000, expenses: 48000 },
    { month: "Jul", profit: 72000, revenue: 125000, expenses: 53000 },
    { month: "Aug", profit: 69000, revenue: 118000, expenses: 49000 },
    { month: "Sep", profit: 78000, revenue: 135000, expenses: 57000 },
    { month: "Oct", profit: 82000, revenue: 142000, expenses: 60000 },
    { month: "Nov", profit: 75000, revenue: 128000, expenses: 53000 },
    { month: "Dec", profit: 88000, revenue: 155000, expenses: 67000 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{`${label} 2024`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ৳${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Monthly Profit Trend
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Revenue vs Expenses vs Profit
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Expenses</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Profit</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.2}
            />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitTrendChart;
