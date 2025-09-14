import { useEffect, useState } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiDownload,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPieChart,
  FiPrinter,
  FiTrendingDown,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const Reports222 = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState("weekly");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [showBalance, setShowBalance] = useState(false);

  // Sample data for reports
  const profitData = {
    daily: { amount: 15420, change: "+12.5%", transactions: 156 },
    weekly: { amount: 89650, change: "+8.3%", transactions: 1024 },
    monthly: { amount: 356780, change: "+15.7%", transactions: 4567 },
  };

  const companyData = [
    {
      name: "bKash",
      profit: 125650,
      percentage: 35.2,
      color: "bg-pink-500",
      transactions: 1245,
    },
    {
      name: "Rocket",
      profit: 98420,
      percentage: 27.6,
      color: "bg-purple-500",
      transactions: 987,
    },
    {
      name: "Upay",
      profit: 76340,
      percentage: 21.4,
      color: "bg-blue-500",
      transactions: 756,
    },
    {
      name: "Nagad",
      profit: 56170,
      percentage: 15.8,
      color: "bg-orange-500",
      transactions: 579,
    },
  ];

  const topCustomers = [
    {
      name: "Ahmed Hassan",
      phone: "+8801712345678",
      profit: 12450,
      transactions: 45,
    },
    {
      name: "Fatima Khan",
      phone: "+8801823456789",
      profit: 9870,
      transactions: 38,
    },
    {
      name: "Rashid Ali",
      phone: "+8801934567890",
      profit: 8760,
      transactions: 32,
    },
    {
      name: "Nasir Uddin",
      phone: "+8801645678901",
      profit: 7650,
      transactions: 28,
    },
    {
      name: "Salma Begum",
      phone: "+8801756789012",
      profit: 6540,
      transactions: 24,
    },
  ];

  const lossData = [
    {
      date: "2024-09-12",
      type: "Wrong Cash Given",
      amount: 500,
      customer: "Ahmed Hassan",
      status: "Pending",
    },
    {
      date: "2024-09-10",
      type: "Customer Didn't Pay",
      amount: 1200,
      customer: "Unknown",
      status: "Investigating",
    },
    {
      date: "2024-09-08",
      type: "System Error",
      amount: 300,
      customer: "Fatima Khan",
      status: "Resolved",
    },
    {
      date: "2024-09-05",
      type: "Wrong Transaction",
      amount: 750,
      customer: "Rashid Ali",
      status: "Resolved",
    },
  ];

  const userProfile = {
    name: "Mohammad Rahman",
    email: "rahman@mobileshop.com",
    phone: "+8801712345678",
    address: "Chittagong, Bangladesh",
    shopName: "Rahman Mobile Banking",
    license: "MBS-2024-001",
    joinDate: "2023-01-15",
    balance: 450750,
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const ProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Information
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiEdit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {userProfile.name.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {userProfile.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {userProfile.shopName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                License: {userProfile.license}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FiMail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userProfile.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FiPhone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userProfile.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FiMapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Address
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userProfile.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FiCalendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Join Date
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userProfile.joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Balance Section */}
            <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Current Balance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">
                      {showBalance
                        ? `৳${userProfile.balance.toLocaleString()}`
                        : "৳ *** ***"}
                    </p>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white hover:text-green-200 transition-colors"
                    >
                      {showBalance ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <FiDollarSign className="w-12 h-12 text-green-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportsSection = () => (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Business Reports
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Companies</option>
              <option value="bkash">bKash</option>
              <option value="rocket">Rocket</option>
              <option value="upay">Upay</option>
              <option value="nagad">Nagad</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Profit Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-8 h-8" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {profitData[dateRange]?.change}
              </span>
            </div>
            <h3 className="text-lg font-semibold opacity-90 capitalize">
              {dateRange} Profit
            </h3>
            <p className="text-3xl font-bold">
              ৳{profitData[dateRange]?.amount.toLocaleString()}
            </p>
            <p className="text-sm opacity-75 mt-2">
              {profitData[dateRange]?.transactions} transactions
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiActivity className="w-8 h-8" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                +5.2%
              </span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Total Revenue</h3>
            <p className="text-3xl font-bold">
              ৳{(profitData[dateRange]?.amount * 1.15).toLocaleString()}
            </p>
            <p className="text-sm opacity-75 mt-2">Including fees & charges</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="w-8 h-8" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">
                +8.7%
              </span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">
              Active Customers
            </h3>
            <p className="text-3xl font-bold">1,247</p>
            <p className="text-sm opacity-75 mt-2">Unique customers served</p>
          </div>
        </div>
      </div>

      {/* Company-wise Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Company-wise Profit Comparison
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {companyData.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${company.color}`}
                  ></div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {company.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {company.transactions} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    ৳{company.profit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {company.percentage}%
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <div className="w-64 h-64 relative">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-500 via-blue-500 to-orange-500 p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <FiPieChart className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Top Earning Customers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  #
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Phone
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Transactions
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Profit Generated
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {customer.phone}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {customer.transactions}
                  </td>
                  <td className="py-4 px-4 font-semibold text-green-600 dark:text-green-400">
                    ৳{customer.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loss Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Loss Tracking
          </h3>
          <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
            <FiTrendingDown className="w-4 h-4" />
            <span className="font-medium">Total Losses: ৳2,750</span>
          </div>
        </div>
        <div className="space-y-3">
          {lossData.map((loss, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900 bg-opacity-50 rounded-lg border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {loss.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {loss.date} • {loss.customer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-red-600 dark:text-red-400">
                  -৳{loss.amount}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loss.status === "Resolved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : loss.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {loss.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FiUser className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "reports"
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FiBarChart2 className="w-5 h-5" />
              Reports & Analytics
            </button>
          </div>

          {/* Content */}
          <div className="transition-all duration-300">
            {activeTab === "profile" ? <ProfileSection /> : <ReportsSection />}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2024 MobilePay Manager. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Powered by React & Tailwind
                </span>
                <button className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-700 text-sm">
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Reports222;
