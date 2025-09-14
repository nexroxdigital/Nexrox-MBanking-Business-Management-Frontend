"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CompanyComparison = () => {
  const companyData = [
    {
      name: "bKash",
      profit: 45000,
      revenue: 85000,
      transactions: 1250,
      color: "#E91E63",
      gradient: "from-pink-500 to-pink-600",
    },
    {
      name: "Rocket",
      profit: 32000,
      revenue: 65000,
      transactions: 890,
      color: "#9C27B0",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      name: "Nagad",
      profit: 28000,
      revenue: 58000,
      transactions: 720,
      color: "#FF9800",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const pieData = companyData.map((company) => ({
    name: company.name,
    value: company.profit,
    color: company.color,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ৳${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/20 dark:border-gray-700/20">
          <p className="font-semibold text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Profit: ৳{data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Company-wise Performance
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Revenue vs Profit comparison
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={companyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.2}
              />
              <XAxis
                dataKey="name"
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
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Profit Distribution
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Share of total profit by company
          </p>
        </div>
        <div className="h-80 flex items-center">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-4">
            {companyData.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${company.gradient} rounded-lg flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white font-bold text-sm">
                      {company.name === "bKash"
                        ? "bK"
                        : company.name === "Rocket"
                        ? "R"
                        : "N"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">
                      {company.name}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {company.transactions} transactions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    ৳{company.profit.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {(
                      (company.profit /
                        companyData.reduce((sum, c) => sum + c.profit, 0)) *
                      100
                    ).toFixed(1)}
                    % share
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyComparison;
