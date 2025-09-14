"use client";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "bKash", value: 45, color: "#EC4899" },
  { name: "Rocket", value: 30, color: "#8B5CF6" },
  { name: "Nagad", value: 25, color: "#F59E0B" },
];

export default function CompanyBreakdown() {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Company-wise Breakdown
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Transaction distribution by payment method
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                border: "none",
                borderRadius: "12px",
                color: "#F9FAFB",
              }}
              formatter={(value) => [`${value}%`, "Share"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ color: "#6B7280" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
