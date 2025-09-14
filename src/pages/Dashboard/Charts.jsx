import {
    Bar,
    BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const DailyTransactionTrends = ({ dailyTrendData }) => {
  return (
    <div className="bg-card-bg dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Daily Transaction Trends
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyTrendData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis dataKey="time" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="url(#gradient)"
              strokeWidth={3}
              dot={{ fill: "#862C8A", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: "#009C91" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#862C8A" />
                <stop offset="100%" stopColor="#009C91" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CompanyWiseBreakdown = ({ companyData }) => {
  return (
    <div className="bg-card-bg dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Company-wise Breakdown
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={companyData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {companyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `₹${props.payload.amount.toLocaleString()}`,
                props.payload.name,
              ]}
              contentStyle={{
                backgroundColor: "#862C8A",
                border: "none",
                borderRadius: "8px",
                color: "#f5f5f5",
              }}
              itemStyle={{
                color: "#f5f5f5", // text inside tooltip rows
              }}
              labelStyle={{
                color: "#f5f5f5", // label text (top)
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        {companyData.map((company) => (
          <div key={company.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: company.color }}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MonthlyProfitLostChart = ({ monthlyProfitData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Monthly Profit/Loss Trend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyProfitData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="profit" fill="#862C8A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="loss" fill="#009C91" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
