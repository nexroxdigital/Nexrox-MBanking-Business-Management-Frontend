import "jspdf-autotable";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const CustomerManagement = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState("list"); // 'list' or 'profile'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

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

  // Sample customer data
  const customers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      phone: "+880 1712 345678",
      address: "Dhaka, Bangladesh",
      notes: "Regular customer, prefers bKash",
      totalTransactions: 45,
      totalIn: 125000,
      totalOut: 98000,
      netBalance: 27000,
      lastTransaction: "2024-09-14",
      transactions: [
        {
          id: 1,
          date: "2024-09-14",
          type: "Cash In",
          amount: 5000,
          company: "bKash",
          fee: 50,
          status: "Completed",
        },
        {
          id: 2,
          date: "2024-09-13",
          type: "Cash Out",
          amount: 3000,
          company: "bKash",
          fee: 30,
          status: "Completed",
        },
        {
          id: 3,
          date: "2024-09-12",
          type: "Send Money",
          amount: 2500,
          company: "Rocket",
          fee: 25,
          status: "Pending",
        },
        {
          id: 4,
          date: "2024-09-11",
          type: "Cash In",
          amount: 8000,
          company: "Nagad",
          fee: 80,
          status: "Completed",
        },
      ],
    },
    {
      id: 2,
      name: "Fatima Rahman",
      phone: "+880 1834 567890",
      address: "Chittagong, Bangladesh",
      notes: "Business client, high volume",
      totalTransactions: 78,
      totalIn: 289000,
      totalOut: 245000,
      netBalance: 44000,
      lastTransaction: "2024-09-13",
      transactions: [
        {
          id: 5,
          date: "2024-09-13",
          type: "Cash In",
          amount: 15000,
          company: "Rocket",
          fee: 150,
          status: "Completed",
        },
        {
          id: 6,
          date: "2024-09-12",
          type: "Cash Out",
          amount: 12000,
          company: "bKash",
          fee: 120,
          status: "Completed",
        },
      ],
    },
    {
      id: 3,
      name: "Mohammad Ali",
      phone: "+880 1956 789012",
      address: "Sylhet, Bangladesh",
      notes: "New customer",
      totalTransactions: 12,
      totalIn: 45000,
      totalOut: 32000,
      netBalance: 13000,
      lastTransaction: "2024-09-12",
      transactions: [
        {
          id: 7,
          date: "2024-09-12",
          type: "Cash In",
          amount: 7000,
          company: "Nagad",
          fee: 70,
          status: "Completed",
        },
      ],
    },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentPage("profile");
  };

  const backToList = () => {
    setCurrentPage("list");
    setSelectedCustomer(null);
  };

  const exportToPDF = (customer) => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customer Transaction Report</title>
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
          .customer-info { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
          }
          .customer-info h3 { 
            margin: 0 0 10px 0; 
            color: #862C8A; 
          }
          .info-row { 
            margin: 5px 0; 
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
          }
          th { 
            background: #862C8A; 
            color: white; 
            font-weight: bold; 
          }
          tr:nth-child(even) { 
            background: #f2f2f2; 
          }
          .status-completed { 
            color: #28a745; 
            font-weight: bold; 
          }
          .status-pending { 
            color: #ffc107; 
            font-weight: bold; 
          }
          .company-bkash { 
            color: #E91E63; 
            font-weight: bold; 
          }
          .company-rocket { 
            color: #9C27B0; 
            font-weight: bold; 
          }
          .company-nagad { 
            color: #FF9800; 
            font-weight: bold; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Customer Transaction Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="customer-info">
          <h3>Customer Information</h3>
          <div class="info-row"><strong>Name:</strong> ${customer.name}</div>
          <div class="info-row"><strong>Phone:</strong> ${customer.phone}</div>
          <div class="info-row"><strong>Address:</strong> ${
            customer.address
          }</div>
          <div class="info-row"><strong>Total Transactions:</strong> ${
            customer.totalTransactions
          }</div>
          <div class="info-row"><strong>Net Balance:</strong> ₹${customer.netBalance.toLocaleString()}</div>
        </div>

        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Company</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${customer.transactions
              .map(
                (t) => `
              <tr>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>${t.type}</td>
                <td class="company-${t.company.toLowerCase()}">${t.company}</td>
                <td>₹${t.amount.toLocaleString()}</td>
                <td>₹${t.fee}</td>
                <td class="status-${t.status.toLowerCase()}">${t.status}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>MobiPay Banking Hub - Customer Transaction Report</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and write the HTML content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print dialog
      printWindow.onload = () => {
        printWindow.print();
        // Close the window after printing (user can cancel this)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    } else {
      // Fallback: download as HTML file if popup is blocked
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${customer.name}-transactions.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const exportToExcel = (customer) => {
    const ws = XLSX.utils.json_to_sheet(
      customer.transactions.map((t) => ({
        Date: t.date,
        Type: t.type,
        Company: t.company,
        Amount: t.amount,
        Fee: t.fee,
        Status: t.status,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `${customer.name}-transactions.xlsx`);
  };

  const CustomerListPage = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all your clients and their transactions
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
          <Plus className="w-5 h-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Customers</option>
                <option value="high-volume">High Volume</option>
                <option value="recent">Recent Activity</option>
              </select>
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, start: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, end: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Net Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.lastTransaction}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {customer.totalTransactions} transactions
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                    ₹{customer.totalIn.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                    ₹{customer.totalOut.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        customer.netBalance >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ₹{customer.netBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewCustomer(customer)}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CustomerProfilePage = () => {
    if (!selectedCustomer) return null;

    const [transactionFilter, setTransactionFilter] = useState("all");
    const [companyFilter, setCompanyFilter] = useState("all");

    const filteredTransactions = selectedCustomer.transactions.filter(
      (transaction) => {
        const typeMatch =
          transactionFilter === "all" ||
          transaction.type.toLowerCase().includes(transactionFilter);
        const companyMatch =
          companyFilter === "all" || transaction.company === companyFilter;
        return typeMatch && companyMatch;
      }
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={backToList}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedCustomer.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Customer Profile & Transaction History
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportToPDF(selectedCustomer)}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportToExcel(selectedCustomer)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Customer Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedCustomer.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Address
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedCustomer.address}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Transactions
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedCustomer.totalTransactions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div
                className={`p-3 rounded-lg ${
                  selectedCustomer.netBalance >= 0
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-red-100 dark:bg-red-900"
                }`}
              >
                <DollarSign
                  className={`w-6 h-6 ${
                    selectedCustomer.netBalance >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Net Balance
                </p>
                <p
                  className={`font-semibold ${
                    selectedCustomer.netBalance >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  ₹{selectedCustomer.netBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Notes
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCustomer.notes}
          </p>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h3>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
              <select
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="cash in">Cash In</option>
                <option value="cash out">Cash Out</option>
                <option value="send">Send Money</option>
              </select>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Companies</option>
                <option value="bKash">bKash</option>
                <option value="Rocket">Rocket</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type.includes("In")
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.company === "bKash"
                            ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                            : transaction.company === "Rocket"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        }`}
                      >
                        {transaction.company}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      ₹{transaction.fee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {transaction.status}
                      </span>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {currentPage === "list" ? <CustomerListPage /> : <CustomerProfilePage />}
    </div>
  );
};

export default CustomerManagement;
