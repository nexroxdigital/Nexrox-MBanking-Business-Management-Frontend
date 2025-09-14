import { useState } from "react";
import CompanyComparison from "./Comparison";
import ProfitLossHeader from "./ProfitLost";
import ProfitSummaryCards from "./ProfitSummary";
import ProfitTrendChart from "./ProfitTrend";
import TopCustomers from "./TopCustomers";

const ReportsTwo = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    console.log("[v0] Period changed to:", period);
  };

  const handleExport = () => {
    console.log("[v0] Exporting reports...");
    // In a real app, this would generate and download a PDF/Excel file
    alert("Export functionality would be implemented here");
  };

  const handlePrint = () => {
    console.log("[v0] Printing reports...");
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <ProfitLossHeader
            onPeriodChange={handlePeriodChange}
            onExport={handleExport}
            onPrint={handlePrint}
          />

          {/* Summary Cards */}
          <ProfitSummaryCards />

          {/* Profit Trend Chart */}
          <ProfitTrendChart />

          {/* Company Comparison */}
          <CompanyComparison />

          {/* Top Customers & Loss Tracking */}
          <TopCustomers />
        </div>
      </main>
    </div>
  );
};

export default ReportsTwo;
