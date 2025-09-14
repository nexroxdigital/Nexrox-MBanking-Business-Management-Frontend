import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CreditCard,
  FileText,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
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

const Dashboard = () => {
  const [isDark, setIsDark] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Sample data
  const dailyTrendData = [
    { time: "06:00", transactions: 12, amount: 45000 },
    { time: "09:00", transactions: 28, amount: 89000 },
    { time: "12:00", transactions: 45, amount: 156000 },
    { time: "15:00", transactions: 38, amount: 134000 },
    { time: "18:00", transactions: 52, amount: 198000 },
    { time: "21:00", transactions: 29, amount: 87000 },
  ];

  const companyData = [
    { name: "bKash", value: 45, amount: 450000, color: "#E91E63" },
    { name: "Rocket", value: 30, amount: 320000, color: "#9C27B0" },
    { name: "Nagad", value: 25, amount: 280000, color: "#FF9800" },
  ];

  const monthlyProfitData = [
    { month: "Jan", profit: 25000, loss: 3000 },
    { month: "Feb", profit: 32000, loss: 4500 },
    { month: "Mar", profit: 28000, loss: 2800 },
    { month: "Apr", profit: 41000, loss: 5200 },
    { month: "May", profit: 38000, loss: 3100 },
    { month: "Jun", profit: 45000, loss: 4800 },
  ];

  const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    gradient,
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`flex items-center space-x-1 text-sm ${
            changeType === "positive"
              ? "text-green-600 dark:text-green-400"
              : changeType === "negative"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-500"
          }`}
        >
          {changeType === "positive" && <TrendingUp className="w-4 h-4" />}
          {changeType === "negative" && <TrendingDown className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </div>
  );

  const QuickActionButton = ({
    title,
    description,
    icon: Icon,
    color,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's your business overview for today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Transactions"
          value="₹2,45,680"
          change="+12.5%"
          changeType="positive"
          icon={Activity}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Today's Profit"
          value="₹18,450"
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
          gradient="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Total Cash In"
          value="₹3,89,200"
          change="+15.3%"
          changeType="positive"
          icon={ArrowDownLeft}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Active Customers"
          value="1,247"
          change="+5.8%"
          changeType="positive"
          icon={Users}
          gradient="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Cash Out"
          value="₹2,26,750"
          change="+3.4%"
          changeType="positive"
          icon={ArrowUpRight}
          gradient="bg-gradient-to-r from-red-500 to-red-600"
        />
        <StatCard
          title="Pending Transactions"
          value="23"
          change="-2"
          changeType="negative"
          icon={Clock}
          gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Transaction Count"
          value="156"
          change="+22"
          changeType="positive"
          icon={CreditCard}
          gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Transaction Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#862C8A" />
                    <stop offset="100%" stopColor="#009C91" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company-wise Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
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
      </div>

      {/* Monthly Profit/Loss Chart */}
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
              <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loss" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            title="Add Customer"
            description="Register a new customer"
            icon={Plus}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            onClick={() => alert("Add Customer clicked")}
          />
          <QuickActionButton
            title="Add Transaction"
            description="Record a new transaction"
            icon={Wallet}
            color="bg-gradient-to-r from-green-500 to-green-600"
            onClick={() => alert("Add Transaction clicked")}
          />
          <QuickActionButton
            title="View Reports"
            description="Generate detailed reports"
            icon={FileText}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            onClick={() => alert("View Reports clicked")}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
