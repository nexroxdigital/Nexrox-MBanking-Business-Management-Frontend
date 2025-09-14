import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CreditCard,
  FileText,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  CompanyWiseBreakdown,
  DailyTransactionTrends,
  MonthlyProfitLostChart,
} from "./Charts";
import QuickActionButton from "./QuickActionButton";
import StatCard from "./StatCard";

const Dashboard = () => {
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

  return (
    <div className="min-h-screen mt-5  bg-gray-100 dark:bg-gray-900 ">
      {/* Header */}
      <div className="bg-gradient-to-t from-fuchsia-200 via-teal-50 to-stone-100 dark:from-transparent dark:via-transparent dark:to-transparent">
        <div className="container mx-auto p-4 sm:px-6 lg:px-8 md:p-6">
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

          {/* Quick Actions */}
          <div className="bg-white mb-8 dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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
      </div>
      {/* Charts Section */}
      <div className="container mx-auto mt-5 p-4 sm:px-6 lg:px-8 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Transaction Trends */}
          <DailyTransactionTrends dailyTrendData={dailyTrendData} />

          {/* Company-wise Breakdown */}
          <CompanyWiseBreakdown companyData={companyData} />
        </div>

        {/* Monthly Profit/Loss Chart */}
        <MonthlyProfitLostChart monthlyProfitData={monthlyProfitData} />
      </div>
    </div>
  );
};

export default Dashboard;
