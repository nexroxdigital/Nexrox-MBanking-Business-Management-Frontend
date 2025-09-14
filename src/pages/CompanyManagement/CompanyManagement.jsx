import {
  Activity,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Search,
  TrendingUp,
  Wallet,
  XCircle,
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
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";

const CompanyManagement = () => {
  const [isDark, setIsDark] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("bKash");
  const [dateRange, setDateRange] = useState("today");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Company data
  const companies = {
    bKash: {
      name: "bKash",
      color: "#E91E63",
      bgGradient: "from-pink-500 to-pink-600",
      lightBg: "bg-pink-50 dark:bg-pink-900/20",
      textColor: "text-pink-600 dark:text-pink-400",
      walletBalance: 458000,
      todayCashIn: 125000,
      todayCashOut: 89000,
      commission: 2340,
      pendingSettlements: 5,
      transactions: [
        {
          id: "BK001",
          type: "Cash In",
          amount: 5000,
          commission: 50,
          customer: "Ahmed Hassan",
          status: "Success",
          date: "2024-09-14 10:30",
          fee: 0.5,
        },
        {
          id: "BK002",
          type: "Cash Out",
          amount: 3000,
          commission: 30,
          customer: "Fatima Rahman",
          status: "Success",
          date: "2024-09-14 11:15",
          fee: 1.0,
        },
        {
          id: "BK003",
          type: "Send Money",
          amount: 2500,
          commission: 12.5,
          customer: "Mohammad Ali",
          status: "Pending",
          date: "2024-09-14 12:00",
          fee: 0.5,
        },
        {
          id: "BK004",
          type: "Payment",
          amount: 1500,
          commission: 15,
          customer: "Rashida Begum",
          status: "Success",
          date: "2024-09-14 14:20",
          fee: 1.0,
        },
      ],
    },
    Rocket: {
      name: "Rocket",
      color: "#9C27B0",
      bgGradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
      walletBalance: 342000,
      todayCashIn: 98000,
      todayCashOut: 76000,
      commission: 1840,
      pendingSettlements: 2,
      transactions: [
        {
          id: "RK001",
          type: "Cash In",
          amount: 8000,
          commission: 80,
          customer: "Karim Sheikh",
          status: "Success",
          date: "2024-09-14 09:45",
          fee: 1.0,
        },
        {
          id: "RK002",
          type: "Cash Out",
          amount: 4500,
          commission: 45,
          customer: "Nasreen Akter",
          status: "Success",
          date: "2024-09-14 13:30",
          fee: 1.0,
        },
        {
          id: "RK003",
          type: "Payment",
          amount: 2200,
          commission: 22,
          customer: "Abdul Hamid",
          status: "Failed",
          date: "2024-09-14 15:10",
          fee: 1.0,
        },
      ],
    },
    Nagad: {
      name: "Nagad",
      color: "#FF9800",
      bgGradient: "from-orange-500 to-orange-600",
      lightBg: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
      walletBalance: 287000,
      todayCashIn: 67000,
      todayCashOut: 54000,
      commission: 1520,
      pendingSettlements: 3,
      transactions: [
        {
          id: "NG001",
          type: "Cash In",
          amount: 6000,
          commission: 60,
          customer: "Salma Khatun",
          status: "Success",
          date: "2024-09-14 08:20",
          fee: 1.0,
        },
        {
          id: "NG002",
          type: "Send Money",
          amount: 3500,
          commission: 17.5,
          customer: "Ibrahim Hossain",
          status: "Pending",
          date: "2024-09-14 16:45",
          fee: 0.5,
        },
      ],
    },
    Upay: {
      name: "Upay",
      color: "#4CAF50",
      bgGradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
      walletBalance: 156000,
      todayCashIn: 34000,
      todayCashOut: 28000,
      commission: 890,
      pendingSettlements: 1,
      transactions: [
        {
          id: "UP001",
          type: "Cash In",
          amount: 4000,
          commission: 40,
          customer: "Marium Begum",
          status: "Success",
          date: "2024-09-14 11:00",
          fee: 1.0,
        },
        {
          id: "UP002",
          type: "Payment",
          amount: 1800,
          commission: 18,
          customer: "Rafiq Ahmed",
          status: "Success",
          date: "2024-09-14 14:30",
          fee: 1.0,
        },
      ],
    },
  };

  // Chart data
  const dailyTrendData = [
    { time: "06:00", cashIn: 15000, cashOut: 8000 },
    { time: "09:00", cashIn: 28000, cashOut: 18000 },
    { time: "12:00", cashIn: 45000, cashOut: 32000 },
    { time: "15:00", cashIn: 38000, cashOut: 28000 },
    { time: "18:00", cashIn: 52000, cashOut: 35000 },
    { time: "21:00", cashIn: 22000, cashOut: 15000 },
  ];

  const weeklyData = [
    { day: "Mon", amount: 125000, commission: 1250 },
    { day: "Tue", amount: 138000, commission: 1380 },
    { day: "Wed", amount: 145000, commission: 1450 },
    { day: "Thu", amount: 132000, commission: 1320 },
    { day: "Fri", amount: 156000, commission: 1560 },
    { day: "Sat", amount: 189000, commission: 1890 },
    { day: "Sun", amount: 167000, commission: 1670 },
  ];

  const transactionTypeData = [
    { name: "Cash In", value: 45, color: "#10B981" },
    { name: "Cash Out", value: 30, color: "#EF4444" },
    { name: "Send Money", value: 15, color: "#8B5CF6" },
    { name: "Payment", value: 10, color: "#F59E0B" },
  ];

  const currentCompany = companies[selectedCompany];

  const filteredTransactions = currentCompany.transactions.filter(
    (transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" ||
        transaction.type.toLowerCase().includes(filterType.toLowerCase());
      return matchesSearch && matchesType;
    }
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      currentCompany.transactions.map((t) => ({
        "Transaction ID": t.id,
        Type: t.type,
        Amount: t.amount,
        Commission: t.commission,
        Customer: t.customer,
        Status: t.status,
        Date: t.date,
        "Fee Rate": t.fee,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(
      wb,
      `${selectedCompany}-transactions-${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };

  const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    bgGradient,
    isAmount = false,
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${bgGradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div
            className={`flex items-center space-x-1 text-sm ${
              changeType === "positive"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {isAmount
            ? `₹${typeof value === "number" ? value.toLocaleString() : value}`
            : value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch (status.toLowerCase()) {
        case "success":
          return {
            color:
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            icon: CheckCircle,
          };
        case "pending":
          return {
            color:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            icon: AlertCircle,
          };
        case "failed":
          return {
            color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            icon: XCircle,
          };
        default:
          return {
            color:
              "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            icon: AlertCircle,
          };
      }
    };

    const { color, icon: StatusIcon } = getStatusConfig(status);

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        <StatusIcon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Company Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage transactions and analytics for mobile banking companies
        </p>
      </div>

      {/* Company Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {Object.keys(companies).map((companyKey) => {
            const company = companies[companyKey];
            return (
              <button
                key={companyKey}
                onClick={() => setSelectedCompany(companyKey)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCompany === companyKey
                    ? `bg-gradient-to-r ${company.bgGradient} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } border border-gray-200 dark:border-gray-700`}
              >
                {company.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Wallet Balance"
          value={currentCompany.walletBalance}
          change="+5.2%"
          changeType="positive"
          icon={Wallet}
          bgGradient={currentCompany.bgGradient}
          isAmount={true}
        />
        <StatCard
          title="Today's Cash In"
          value={currentCompany.todayCashIn}
          change="+12.3%"
          changeType="positive"
          icon={ArrowDownLeft}
          bgGradient="from-green-500 to-green-600"
          isAmount={true}
        />
        <StatCard
          title="Today's Cash Out"
          value={currentCompany.todayCashOut}
          change="+8.7%"
          changeType="positive"
          icon={ArrowUpRight}
          bgGradient="from-red-500 to-red-600"
          isAmount={true}
        />
        <StatCard
          title="Commission Earned"
          value={currentCompany.commission}
          change="+15.4%"
          changeType="positive"
          icon={DollarSign}
          bgGradient="from-blue-500 to-blue-600"
          isAmount={true}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Pending Settlements"
          value={currentCompany.pendingSettlements}
          icon={Clock}
          bgGradient="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Active Transactions"
          value={currentCompany.transactions.length}
          change="+3"
          changeType="positive"
          icon={Activity}
          bgGradient="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Transaction Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="time"
                  className="stroke-gray-500 dark:stroke-gray-400"
                />
                <YAxis className="stroke-gray-500 dark:stroke-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                    border: isDark ? "none" : "1px solid #E5E7EB",
                    borderRadius: "8px",
                    color: isDark ? "#fff" : "#374151",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cashIn"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="cashOut"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: "#EF4444", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Types Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transaction Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={transactionTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {transactionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                    border: isDark ? "none" : "1px solid #E5E7EB",
                    borderRadius: "8px",
                    color: isDark ? "#fff" : "#374151",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {transactionTypeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Performance
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-300 dark:stroke-gray-600"
              />
              <XAxis
                dataKey="day"
                className="stroke-gray-500 dark:stroke-gray-400"
              />
              <YAxis className="stroke-gray-500 dark:stroke-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                  border: isDark ? "none" : "1px solid #E5E7EB",
                  borderRadius: "8px",
                  color: isDark ? "#fff" : "#374151",
                }}
              />
              <Bar
                dataKey="amount"
                fill={currentCompany.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction History
          </h3>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="cash in">Cash In</option>
              <option value="cash out">Cash Out</option>
              <option value="send">Send Money</option>
              <option value="payment">Payment</option>
            </select>
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type.includes("In")
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : transaction.type.includes("Out")
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : transaction.type.includes("Send")
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                    ₹{transaction.commission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;
