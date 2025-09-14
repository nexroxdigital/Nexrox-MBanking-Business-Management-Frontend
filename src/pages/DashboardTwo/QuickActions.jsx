"use client";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Customer",
      description: "Register new customer",
      icon: (
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      action: () => console.log("Add Customer clicked"),
    },
    {
      title: "Add Transaction",
      description: "Record new transaction",
      icon: (
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
      ),
      color: "from-green-500 to-green-600",
      action: () => console.log("Add Transaction clicked"),
    },
    {
      title: "View Reports",
      description: "Generate detailed reports",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      action: () => console.log("View Reports clicked"),
    },
    {
      title: "Export Data",
      description: "Download transaction data",
      icon: (
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "from-orange-500 to-orange-600",
      action: () => console.log("Export Data clicked"),
    },
  ];

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Quick Actions
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Frequently used operations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="group p-4 rounded-xl bg-gradient-to-r hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-left"
            style={{
              background: `linear-gradient(135deg, ${action.color
                .split(" ")[0]
                .replace("from-", "")} 0%, ${action.color
                .split(" ")[1]
                .replace("to-", "")} 100%)`,
            }}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                {action.icon}
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">
                  {action.title}
                </h4>
                <p className="text-white/80 text-xs">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
