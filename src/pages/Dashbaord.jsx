import { useEffect, useState } from "react";
import { fmtBDT, todayISO } from "./utils";

import { CiMoneyCheck1 } from "react-icons/ci";
import { FaListAlt } from "react-icons/fa";
import AllTransactions from "../components/AllTransactions/AllTransactions";
import { ReportColumns } from "../components/columns/ReportColumns";
import TableComponent from "../components/shared/Table/Table";
import {
  useLast30DaysReport,
  useMonthlyReport,
  useTodaysReport,
  useWalletWiseReport,
} from "../hooks/useDailyTxn";
import { useOpeningCash } from "../hooks/useOpeningCash";
import { useTransactions } from "../hooks/useTransaction";
import { useWalletNumbers } from "../hooks/useWallet";

export default function Dashboard() {
  const [openingModalOpen, setOpeningModalOpen] = useState(false);
  const [openingCash, setOpeningCash] = useState(0);

  const {
    data: openingCashData,
    isLoading: openingCashLoading,
    mutation: openingCashMutation,
  } = useOpeningCash();

  useEffect(() => {
    if (openingCashData) {
      setOpeningCash(openingCashData?.amount);
    }
  }, [openingCashData]);

  const { data, isLoading, isError } = useWalletWiseReport();

  const today = todayISO();
  const monthName = new Date().toLocaleDateString("bn-BD", { month: "long" });
  const { data: todayReport, isLoading: todayReportLoading } =
    useTodaysReport();

  const { data: monthlyTotalReport, isLoading: monthlyTotalReportLoading } =
    useMonthlyReport();

  const { data: last30DaysReport, isLoading: last30DaysReportLoading } =
    useLast30DaysReport();

  const [lastMonthSummary, setLastMonthSummary] = useState([]);

  useEffect(() => {
    if (last30DaysReport?.data) {
      setLastMonthSummary(last30DaysReport?.data.reverse());
    }
  }, [last30DaysReport]);

  const handleSubmitOpeningBalance = (e) => {
    e.preventDefault();

    openingCashMutation.mutate(
      { amount: openingCash },
      {
        onSettled: () => {
          setOpeningModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-200px)] transition-colors duration-300">
      {/* Modern background with floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#862C8A]/20 to-[#009C91]/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-[#009C91]/15 to-[#862C8A]/15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10 blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto py-8">
        {/* Modern header with glassmorphism effect */}
        <header className="mb-8 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-3xl p-6 shadow-md border border-white/20 dark:border-gray-800/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#862C8A] to-[#009C91] bg-clip-text text-transparent">
                ড্যাশবোর্ড
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {new Date(today).toLocaleDateString("bn-BD")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3">
              <div
                onClick={() => setOpeningModalOpen(true)}
                className="px-4 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-[#99359fe7] to-[#028980ec] border border-[#862C8A]/20 dark:border-[#009C91]/20"
              >
                <span className="text-sm font-semibold dark:text-gray-300 text-white">
                  Add Opening Cash
                </span>
              </div>

              {openingCashLoading ? (
                <div className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                  <span className="font-bold">Loading...</span>
                </div>
              ) : (
                openingCash > 0 && (
                  <div className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                    Opening Cash:{" "}
                    <span className="font-bold">৳{fmtBDT(openingCash)}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </header>

        {/* Modern stats grid */}
        <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="আজকের বিক্রি"
            value={`৳${fmtBDT(todayReport?.totals?.totalSale)}`}
            sub={new Date(today).toLocaleDateString("bn-BD")}
            icon=""
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="আজকের লাভ"
            value={`৳${fmtBDT(todayReport?.totals?.totalProfit)}`}
            sub={new Date(today).toLocaleDateString("bn-BD")}
            icon=""
            gradient="from-blue-500 to-cyan-600"
          />
          <StatCard
            title="আজকের পাওনা"
            value={`৳${fmtBDT(todayReport?.totals?.totalDue)}`}
            sub={new Date(today).toLocaleDateString("bn-BD")}
            icon=""
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard
            title={`মাসিক সারাংশ (${monthName})`}
            value={`৳${fmtBDT(monthlyTotalReport?.totals?.totalSale)}`}
            sub={`লাভ: ৳${fmtBDT(
              monthlyTotalReport?.totals?.totalProfit
            )} __ পাওনা: ৳${fmtBDT(monthlyTotalReport?.totals?.totalDue)}`}
            icon=""
            gradient="from-[#862C8A] to-[#009C91]"
          />
        </div>

        {/* Modern bottom panels */}
        <div className="grid gap-8 lg:grid-cols-2">
          <ActivityLog />
          <NumberBalances />
        </div>
      </div>

      {openingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpeningModalOpen(false)}
          />
          <div
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Add Opening Cash
            </h2>

            <form onSubmit={handleSubmitOpeningBalance} className="space-y-4">
              <input
                type="number"
                step="any"
                value={openingCash}
                onChange={(e) => setOpeningCash(Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter cash amount"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpeningModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                >
                  {openingCashMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-6">
        {/* Number-wise Report */}
        <div className="md:col-span-2 rounded-2xl border border-gray-300 shadow-sm overflow-hidden bg-white">
          {/* Gradient Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
            }}
          >
            <div className="flex flex-col gap-1 md:flex-row justify-between w-full">
              <h3 className="font-semibold text-white">
                নম্বারভিত্তিক রিপোর্ট
              </h3>
              <p className="text-white text-sm">
                তারিখ:{" "}
                {data?.date
                  ? new Date(data.date).toLocaleDateString("bn-BD")
                  : "লোড হচ্ছে..."}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-5">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                      <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div
                className="overflow-x-auto"
                style={{
                  borderImageSlice: 1,
                  borderImageSource:
                    "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                }}
              >
                <table className="w-full text-sm table-fixed">
                  <thead className="bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white">
                    <tr className="text-left border-0 border-b border-b-gray-400">
                      <th className="py-3 px-4  text-left sticky top-0 border-0 border-r border-r-gray-100">
                        নম্বর
                      </th>
                      <th className="py-3 px-4 text-left border-0 border-r border-r-gray-100">
                        লেনদেন
                      </th>
                      <th className="py-3 px-4 text-left">মোট</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((n) => (
                      <tr
                        key={n?.wallet?._id}
                        className="group rounded-xl border border-gray-100 bg-white hover:shadow-sm transition"
                      >
                        <td className="py-4 px-4 rounded-l-xl border-0 border-r border-r-gray-400 border-b border-b-gray-200">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{
                                background:
                                  "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                              }}
                            />
                            <span className="truncate" title={n?.wallet?.label}>
                              {n?.wallet?.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-left text-gray-800 border-0 border-r border-r-gray-400 border-b border-b-gray-200">
                          {n?.txnCount}
                        </td>
                        <td className="py-4 px-4 text-left rounded-r-xl border-b border-b-gray-200">
                          <span
                            className="px-2.5 py-1 rounded-lg font-semibold text-gray-900"
                            style={{
                              background:
                                "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                            }}
                          >
                            ৳{fmtBDT(n?.totalTxnAmount)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {data.data.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-8 text-center text-gray-400"
                        >
                          <div
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                            style={{
                              background:
                                "linear-gradient(270deg, #862C8A33 0%, #009C9133 100%)",
                            }}
                          >
                            <span className="text-2xl opacity-80">📊</span>
                          </div>
                          ডেটা নেই
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Summary (Last 30 days) */}
        <div className="md:col-span-3 rounded-2xl border border-gray-300 shadow-sm overflow-hidden bg-white">
          {/* Gradient Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
            }}
          >
            <h3 className="font-semibold text-white">
              সারসংক্ষেপ (শেষ ৩০ দিন)
            </h3>
            <span className="text-sm px-2 py-1 rounded-lg bg-white/15 text-white/90">
              {last30DaysReport?.period?.from &&
                new Date(last30DaysReport.period.from).toLocaleDateString(
                  "bn-BD"
                )}{" "}
              থেকে{" "}
              {last30DaysReport?.period?.to &&
                new Date(last30DaysReport.period.to).toLocaleDateString(
                  "bn-BD"
                )}
            </span>
          </div>

          <div className="p-5">
            <TableComponent
              data={lastMonthSummary}
              columns={ReportColumns}
              pagination=""
              setPagination=""
              pageCount=""
              isFetching={false}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ title, value, sub, icon, gradient }) {
  return (
    <div className="group relative overflow-hidden">
      {/* Main card with glassmorphism */}
      <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-6 shadow-xl border border-gray-300 border-t-transparent dark:border-gray-800/20 transition-all duration-300">
        {/* Animated gradient border */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0  transition-opacity duration-300 blur-sm`}
        />

        {/* Top accent line with animation */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient} rounded-t-2xl`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${gradient} animate-pulse`}
          />
        </div>

        {/* Icon and title */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-base md:text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center">
            <span className="text-xl">{icon}</span>
            {title}
          </div>
          {/* <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${gradient} opacity-80 flex items-center justify-center`}
          >
            <div className="w-3 h-3 rounded-full bg-white/80 animate-pulse" />
          </div> */}
        </div>

        {/* Value */}
        <div className="mb-3">
          <div className="text-3xl font-bold text-gray-900 dark:text-white transition-transform duration-300">
            {value}
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {sub}
        </div>

        {/* Floating decoration */}
        <div
          className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-gradient-to-r ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
        />
      </div>
    </div>
  );
}

function NumberBalances() {
  const { data: walletNumbers, isLoading, isError } = useWalletNumbers();

  if (isError)
    return (
      <div className="p-2 text-center text-red-500">
        {" "}
        Error on fetching data
      </div>
    );

  return (
    <div className="group relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-lg p-8 shadow-md border border-gray-300 border-b-transparent dark:border-gray-800/20 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <PanelTitle title="নম্বারভিত্তিক ব্যালেন্স" icon={<CiMoneyCheck1 />} />

      {isLoading ? (
        <div className="p-2 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            {/* Table Header */}
            <thead>
              <tr className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 text-left rounded-l-xl">
                  লেবেল
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 text-left">
                  চ্যানেল
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 text-left">
                  টাইপ
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300  text-center rounded-r-xl">
                  ব্যালেন্স
                </th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody>
              {walletNumbers?.map((n, index) => (
                <tr
                  key={n._id}
                  className="rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-100/50 dark:border-gray-700/50 shadow hover:shadow-lg group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2 rounded-l-xl">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#862C8A] to-[#009C91] opacity-60 group-hover:opacity-100 transition-opacity" />
                    {n.label}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">
                    {n.channel}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">
                    {n.type}
                  </td>
                  <td className="p-4 text-center font-bold text-gray-900 dark:text-white rounded-r-xl">
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10">
                      ৳{fmtBDT(n.balance || 0)}
                    </span>
                  </td>
                </tr>
              ))}

              {walletNumbers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#862C8A]/20 to-[#009C91]/20 flex items-center justify-center">
                      <span className="text-2xl opacity-60">💳</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 font-medium">
                      কোন নম্বর যোগ করা হয়নি
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10 blur-2xl group-hover:scale-110 transition-transform duration-500" />
    </div>
  );
}

function ActivityLog() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransactions(6);

  const allTransactions = data?.pages.flatMap((p) => p.data) || [];

  return (
    <div className="group relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-lg p-8 shadow-md border border-gray-300 border-b-transparent dark:border-gray-800/20 transition-all duration-300">
      {/* Animated background */}
      {/* <div className="absolute inset-0 bg-gradient-to-bl from-[#009C91]/5 to-[#862C8A]/5 group-hover:from-[#009C91]/10 group-hover:to-[#862C8A]/10 transition-all duration-500" /> */}

      <PanelTitle title="লগ" icon={<FaListAlt />} />

      <AllTransactions
        transactions={allTransactions}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      {/* Floating decoration */}
      <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-r from-[#009C91]/10 to-[#862C8A]/10 blur-2xl group-hover:scale-110 transition-transform duration-500" />
    </div>
  );
}

function PanelTitle({ title, icon }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] flex items-center justify-center">
          <span className="text-white text-sm">{icon}</span>
        </div>
        {title}
      </h3>
      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-800/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-green-700 dark:text-green-300">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}
