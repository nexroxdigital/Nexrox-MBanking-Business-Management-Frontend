import CompanyBreakdown from "./CompanyBreakdown";
import QuickActions from "./QuickActions";
import StatCard from "./StatCard";
import TransactionChart from "./TransactionChart";

export default function DashboardTwo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Here's your business overview for today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Transactions"
            value="247"
            subtitle="৳3,45,670 total amount"
            trend="up"
            trendValue="+12%"
            color="blue"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />

          <StatCard
            title="Today's Profit"
            value="৳12,450"
            subtitle="Net profit after fees"
            trend="up"
            trendValue="+8%"
            color="green"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            }
          />

          <StatCard
            title="Cash In vs Out"
            value="৳2,89,340"
            subtitle="৳56,330 cash out today"
            trend="up"
            trendValue="+15%"
            color="purple"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            }
          />

          <StatCard
            title="Active Customers"
            value="89"
            subtitle="12 new customers today"
            trend="up"
            trendValue="+5%"
            color="orange"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TransactionChart />
          <CompanyBreakdown />
        </div>

        {/* Quick Actions and Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>

          {/* Pending Transactions */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Pending Transactions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Transactions awaiting confirmation
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">bK</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ৳5,500
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Customer: Rahman
                    </p>
                  </div>
                </div>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ৳2,300
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Customer: Fatima
                    </p>
                  </div>
                </div>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  Pending
                </span>
              </div>

              <div className="text-center pt-4">
                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                  View All Pending (5)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
