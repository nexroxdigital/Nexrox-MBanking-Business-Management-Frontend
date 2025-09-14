 

import { useState } from "react";

const CompanySettings = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "bKash",
      type: "percentage",
      commission: 2.5,
      balance: 45000,
      color: "from-pink-500 to-pink-600",
      icon: "💳",
      status: "active",
    },
    {
      id: 2,
      name: "Rocket",
      type: "fixed",
      commission: 15,
      balance: 32000,
      color: "from-purple-500 to-purple-600",
      icon: "🚀",
      status: "active",
    },
    {
      id: 3,
      name: "Nagad",
      type: "percentage",
      commission: 3.0,
      balance: 28000,
      color: "from-orange-500 to-orange-600",
      icon: "💰",
      status: "active",
    },
    {
      id: 4,
      name: "Upay",
      type: "fixed",
      commission: 20,
      balance: 15000,
      color: "from-green-500 to-green-600",
      icon: "📱",
      status: "inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    commission: "",
    balance: "",
    status: "active",
  });

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      commission: company.commission,
      balance: company.balance,
      status: company.status,
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      type: "percentage",
      commission: "",
      balance: "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCompany) {
      setCompanies(
        companies.map((company) =>
          company.id === editingCompany.id
            ? {
                ...company,
                ...formData,
                commission: Number.parseFloat(formData.commission),
                balance: Number.parseFloat(formData.balance),
              }
            : company
        )
      );
    } else {
      const newCompany = {
        id: Date.now(),
        ...formData,
        commission: Number.parseFloat(formData.commission),
        balance: Number.parseFloat(formData.balance),
        color: "from-blue-500 to-blue-600",
        icon: "🏦",
      };
      setCompanies([...companies, newCompany]);
    }
    setShowModal(false);
  };

  const handleAddBalance = (companyId, amount) => {
    setCompanies(
      companies.map((company) =>
        company.id === companyId
          ? { ...company, balance: company.balance + Number.parseFloat(amount) }
          : company
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Company Management
        </h2>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Add New Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${company.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}
                >
                  {company.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {company.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {company.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleEdit(company)}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Balance
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ৳{company.balance.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Commission
                </span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {company.type === "percentage"
                    ? `${company.commission}%`
                    : `৳${company.commission}`}
                  {company.type === "fixed" && " per 1000"}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200/20 dark:border-gray-700/20">
                <button
                  onClick={() => {
                    const amount = prompt("Enter amount to add:");
                    if (amount && !isNaN(amount)) {
                      handleAddBalance(company.id, amount);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-md transform hover:scale-105 transition-all duration-200"
                >
                  Add Balance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingCompany ? "Edit Company" : "Add New Company"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commission Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (৳)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commission{" "}
                  {formData.type === "percentage" ? "(%)" : "(৳ per 1000)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.commission}
                  onChange={(e) =>
                    setFormData({ ...formData, commission: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="Enter commission"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initial Balance (৳)
                </label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="Enter initial balance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {editingCompany ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySettings;
