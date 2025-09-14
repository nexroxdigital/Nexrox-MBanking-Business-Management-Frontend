import { useState } from "react";
import ClientSettings from "./ClientSettings";
import CompanySettings from "./CompanySettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("companies");

  const tabs = [
    {
      id: "companies",
      name: "Companies",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: "clients",
      name: "Clients",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container p-4  md:p-6 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your companies, commissions, and client information
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-2 border border-gray-200/20 dark:border-gray-700/20 shadow-lg mb-8">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span
                  className={`transition-transform duration-200 ${
                    activeTab === tab.id ? "scale-110" : ""
                  }`}
                >
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
          {activeTab === "companies" && <CompanySettings />}
          {activeTab === "clients" && <ClientSettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
