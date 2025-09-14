import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Mon", bkash: 45000, rocket: 32000, nagad: 28000 },
  { name: "Tue", bkash: 52000, rocket: 38000, nagad: 31000 },
  { name: "Wed", bkash: 48000, rocket: 35000, nagad: 29000 },
  { name: "Thu", bkash: 61000, rocket: 42000, nagad: 35000 },
  { name: "Fri", bkash: 58000, rocket: 45000, nagad: 38000 },
  { name: "Sat", bkash: 67000, rocket: 48000, nagad: 41000 },
  { name: "Sun", bkash: 55000, rocket: 40000, nagad: 33000 },
];

export default function TransactionChart() {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Transaction Trends
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Weekly overview of transactions by payment method
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                border: "none",
                borderRadius: "12px",
                color: "#F9FAFB",
              }}
              formatter={(value) => [`৳${value.toLocaleString()}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="bkash"
              stroke="#EC4899"
              strokeWidth={3}
              dot={{ fill: "#EC4899", strokeWidth: 2, r: 4 }}
              name="bKash"
            />
            <Line
              type="monotone"
              dataKey="rocket"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              name="Rocket"
            />
            <Line
              type="monotone"
              dataKey="nagad"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
              name="Nagad"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
