import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Plus,
  Save,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const Transactions = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'add', 'edit'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    company: "all",
    customer: "all",
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Sample transaction data
  const transactions = [
    {
      id: "TXN001",
      company: "bKash",
      customer: "Ahmed Hassan",
      customerId: "CUST001",
      amount: 5000,
      type: "Cash In",
      commission: 50,
      status: "Success",
      date: "2024-09-14",
      time: "10:30:00",
      fee: 0.5,
      reference: "BK20240914001",
      notes: "Regular cash in transaction",
    },
    {
      id: "TXN002",
      company: "Rocket",
      customer: "Fatima Rahman",
      customerId: "CUST002",
      amount: 3000,
      type: "Cash Out",
      commission: 30,
      status: "Success",
      date: "2024-09-14",
      time: "11:15:00",
      fee: 1.0,
      reference: "RK20240914001",
      notes: "Business withdrawal",
    },
    {
      id: "TXN003",
      company: "Nagad",
      customer: "Mohammad Ali",
      customerId: "CUST003",
      amount: 2500,
      type: "Send Money",
      commission: 12.5,
      status: "Pending",
      date: "2024-09-14",
      time: "12:00:00",
      fee: 0.5,
      reference: "NG20240914001",
      notes: "Family remittance",
    },
    {
      id: "TXN004",
      company: "Upay",
      customer: "Rashida Begum",
      customerId: "CUST004",
      amount: 1500,
      type: "Payment",
      commission: 15,
      status: "Failed",
      date: "2024-09-13",
      time: "14:20:00",
      fee: 1.0,
      reference: "UP20240913001",
      notes: "Bill payment failed - insufficient balance",
    },
    {
      id: "TXN005",
      company: "bKash",
      customer: "Karim Sheikh",
      customerId: "CUST005",
      amount: 8000,
      type: "Cash In",
      commission: 80,
      status: "Success",
      date: "2024-09-13",
      time: "09:45:00",
      fee: 1.0,
      reference: "BK20240913002",
      notes: "Large deposit",
    },
  ];

  const companies = ["bKash", "Rocket", "Nagad", "Upay"];
  const transactionTypes = [
    "Cash In",
    "Cash Out",
    "Send Money",
    "Payment",
    "Mobile Recharge",
  ];
  const statuses = ["Success", "Pending", "Failed"];

  const getCompanyColor = (company) => {
    switch (company) {
      case "bKash":
        return "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/20";
      case "Rocket":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20";
      case "Nagad":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20";
      case "Upay":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

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
          icon: Clock,
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

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCompany =
      filters.company === "all" || transaction.company === filters.company;
    const matchesType =
      filters.type === "all" || transaction.type === filters.type;
    const matchesStatus =
      filters.status === "all" || transaction.status === filters.status;

    const matchesDateFrom =
      !filters.dateFrom || transaction.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || transaction.date <= filters.dateTo;

    return (
      matchesSearch &&
      matchesCompany &&
      matchesType &&
      matchesStatus &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const exportToExcel = () => {
    const dataToExport =
      selectedTransactions.length > 0
        ? transactions.filter((t) => selectedTransactions.includes(t.id))
        : filteredTransactions;

    const ws = XLSX.utils.json_to_sheet(
      dataToExport.map((t) => ({
        "Transaction ID": t.id,
        Company: t.company,
        Customer: t.customer,
        Amount: t.amount,
        Type: t.type,
        Commission: t.commission,
        Status: t.status,
        Date: t.date,
        Time: t.time,
        Reference: t.reference,
        Notes: t.notes,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(
      wb,
      `transactions-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const exportToPDF = () => {
    const dataToExport =
      selectedTransactions.length > 0
        ? transactions.filter((t) => selectedTransactions.includes(t.id))
        : filteredTransactions;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transaction Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
          }
          .header { 
            color: #862C8A; 
            border-bottom: 2px solid #862C8A; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            font-size: 12px;
          }
          th { 
            background: #862C8A; 
            color: white; 
            font-weight: bold; 
          }
          tr:nth-child(even) { 
            background: #f2f2f2; 
          }
          .company-bkash { color: #E91E63; font-weight: bold; }
          .company-rocket { color: #9C27B0; font-weight: bold; }
          .company-nagad { color: #FF9800; font-weight: bold; }
          .company-upay { color: #4CAF50; font-weight: bold; }
          .status-success { color: #28a745; font-weight: bold; }
          .status-pending { color: #ffc107; font-weight: bold; }
          .status-failed { color: #dc3545; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Transaction Management Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()} | Total Records: ${
      dataToExport.length
    }</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Commission</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${dataToExport
              .map(
                (t) => `
              <tr>
                <td>${t.id}</td>
                <td class="company-${t.company.toLowerCase()}">${t.company}</td>
                <td>${t.customer}</td>
                <td>${t.type}</td>
                <td>₹${t.amount.toLocaleString()}</td>
                <td>₹${t.commission}</td>
                <td class="status-${t.status.toLowerCase()}">${t.status}</td>
                <td>${t.date} ${t.time}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>MobiPay Banking Hub - Transaction Management System</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  };

  // Transaction List View
  const TransactionListView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transaction Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all transactions across all companies
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCurrentView("add")}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredTransactions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Transactions
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹
                {filteredTransactions
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹
                {filteredTransactions
                  .reduce((sum, t) => sum + t.commission, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Commission
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  filteredTransactions.filter((t) => t.status === "Pending")
                    .length
                }
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, customer, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300">
              Advanced Filters
            </span>
          </button>
        </div>

        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select
                value={filters.company}
                onChange={(e) =>
                  setFilters({ ...filters, company: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="From Date"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="To Date"
              />
              <button
                onClick={() =>
                  setFilters({
                    company: "all",
                    type: "all",
                    status: "all",
                    dateFrom: "",
                    dateTo: "",
                  })
                }
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions(
                          filteredTransactions.map((t) => t.id)
                        );
                      } else {
                        setSelectedTransactions([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => {
                const statusConfig = getStatusConfig(transaction.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTransactions([
                              ...selectedTransactions,
                              transaction.id,
                            ]);
                          } else {
                            setSelectedTransactions(
                              selectedTransactions.filter(
                                (id) => id !== transaction.id
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCompanyColor(
                          transaction.company
                        )}`}
                      >
                        {transaction.company}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.customer}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{transaction.date}</div>
                      <div>{transaction.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setCurrentView("edit");
                          }}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Add/Edit Transaction Form
  const TransactionForm = ({ isEdit = false }) => {
    const [formData, setFormData] = useState(
      isEdit && selectedTransaction
        ? selectedTransaction
        : {
            id: "",
            company: "",
            customer: "",
            customerId: "",
            amount: "",
            type: "",
            commission: "",
            status: "Pending",
            date: new Date().toISOString().split("T")[0],
            time: new Date().toTimeString().slice(0, 8),
            fee: "",
            reference: "",
            notes: "",
          }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission here
      console.log("Form submitted:", formData);
      setCurrentView("list");
    };

    const calculateCommission = (amount, type, company) => {
      if (!amount || !type || !company) return 0;

      const commissionRates = {
        bKash: {
          "Cash In": 1.0,
          "Cash Out": 1.0,
          "Send Money": 0.5,
          Payment: 1.0,
          "Mobile Recharge": 2.0,
        },
        Rocket: {
          "Cash In": 1.0,
          "Cash Out": 1.0,
          "Send Money": 0.5,
          Payment: 1.0,
          "Mobile Recharge": 2.0,
        },
        Nagad: {
          "Cash In": 1.0,
          "Cash Out": 1.0,
          "Send Money": 0.5,
          Payment: 1.0,
          "Mobile Recharge": 2.0,
        },
        Upay: {
          "Cash In": 1.0,
          "Cash Out": 1.0,
          "Send Money": 0.5,
          Payment: 1.0,
          "Mobile Recharge": 2.0,
        },
      };

      const rate = commissionRates[company]?.[type] || 1.0;
      return ((parseFloat(amount) * rate) / 100).toFixed(2);
    };

    // Auto-calculate commission when amount, type, or company changes
    useEffect(() => {
      if (formData.amount && formData.type && formData.company) {
        const commission = calculateCommission(
          formData.amount,
          formData.type,
          formData.company
        );
        setFormData((prev) => ({ ...prev, commission: commission }));
      }
    }, [formData.amount, formData.type, formData.company]);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView("list")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Edit Transaction" : "Add New Transaction"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEdit
                ? "Update transaction details"
                : "Create a new transaction record"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Transaction Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="TXN001"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <select
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transaction Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Type</option>
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Commission (Auto-calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commission (₹)
                </label>
                <input
                  type="number"
                  value={formData.commission}
                  onChange={(e) =>
                    setFormData({ ...formData, commission: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  placeholder="Auto-calculated"
                  step="0.01"
                  readOnly
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Auto-calculated based on amount and type
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Fee Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fee Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.fee}
                  onChange={(e) =>
                    setFormData({ ...formData, fee: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1.0"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="BK20240914001"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Add any additional notes or comments..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setCurrentView("list")}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? "Update Transaction" : "Save Transaction"}</span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render based on current view
  return (
    <div className="min-h-screen container mx-auto sm:px-6 lg:px-8 md:p-6 bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {currentView === "list" && <TransactionListView />}
      {currentView === "add" && <TransactionForm />}
      {currentView === "edit" && <TransactionForm isEdit={true} />}
    </div>
  );
};

export default Transactions;
