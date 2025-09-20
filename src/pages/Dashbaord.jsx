import { useMemo, useState } from "react";
import {
  computeBalances,
  computeSums,
  fmtBDT,
  monthKey,
  todayISO,
  uid,
} from "./utils";

import { CiMoneyCheck1 } from "react-icons/ci";

export default function Dashboard({ ctx }) {
  const { state, dispatch } = ctx;
  const today = todayISO();
  const [openingModalOpen, setOpeningModalOpen] = useState(false);
  const [openingCash, setOpeningCash] = useState("");

  const sums = useMemo(
    () => computeSums(state.transactions, state.clients),
    [state.transactions, state.clients]
  );

  const month = monthKey(today);
  const monthSums = sums.byMonth[month] || { sell: 0, profit: 0, due: 0 };
  const daySums = sums.byDay[today] || { sell: 0, profit: 0, due: 0 };

  function saveOpeningCash(e) {
    e.preventDefault();

    const next = {
      ...state,
      openingCash: openingCash,
      logs: [
        ...state.logs,
        {
          id: uid("log"),
          ts: new Date().toISOString(),
          msg: `Opening Cash সেট করা হয়েছে: ৳${fmtBDT(openingCash)}`,
        },
      ],
    };

    // ✅ update state
    dispatch({ type: "SAVE", payload: next });

    console.log("saveOpeningCash", {
      date: today,
      amount: Number(openingCash),
    });
    setOpeningModalOpen(false);
    setOpeningCash("");
  }
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Modern background with floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#862C8A]/20 to-[#009C91]/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-[#009C91]/15 to-[#862C8A]/15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10 blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto py-8">
        {/* Modern header with glassmorphism effect */}
        <header className="mb-8 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-3xl p-6 shadow-md border border-white/20 dark:border-gray-800/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#862C8A] to-[#009C91] bg-clip-text text-transparent">
                ড্যাশবোর্ড
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {today}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div
                onClick={() => setOpeningModalOpen(true)}
                className="px-4 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-[#99359fe7] to-[#028980ec] border border-[#862C8A]/20 dark:border-[#009C91]/20"
              >
                <span className="text-sm font-semibold dark:text-gray-300 text-white">
                  Add Opening Cash
                </span>
              </div>

              {state.openingCash > 0 && (
                <div className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                  Opening Cash:{" "}
                  <span className="font-bold">
                    ৳{fmtBDT(state.openingCash)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Modern stats grid */}
        <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="আজকের বিক্রি"
            value={`৳${fmtBDT(daySums.sell)}`}
            sub={today}
            icon=""
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="আজকের লাভ/কমিশন"
            value={`৳${fmtBDT(daySums.profit)}`}
            sub={today}
            icon=""
            gradient="from-blue-500 to-cyan-600"
          />
          <StatCard
            title="আজকের পাওনা"
            value={`৳${fmtBDT(daySums.due)}`}
            sub={today}
            icon=""
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard
            title="মাসিক সারাংশ"
            value={`৳${fmtBDT(monthSums.sell)}`}
            sub={`লাভ ৳${fmtBDT(monthSums.profit)} · পাওনা ৳${fmtBDT(
              monthSums.due
            )}`}
            icon=""
            gradient="from-[#862C8A] to-[#009C91]"
          />
        </div>

        {/* Modern bottom panels */}
        <div className="grid gap-8 lg:grid-cols-2">
          <NumberBalances
            numbers={state.numbers}
            transactions={state.transactions}
          />
          <ActivityLog logs={state.logs} />
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
            <form onSubmit={saveOpeningCash} className="space-y-4">
              <input
                type="number"
                step="0.01"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

function NumberBalances({ numbers, transactions }) {
  const balances = useMemo(
    () => computeBalances(numbers, transactions),
    [numbers, transactions]
  );

  return (
    <div className="group relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-lg p-8 shadow-md border border-gray-300 border-b-transparent dark:border-gray-800/20 transition-all duration-300 overflow-hidden">
      {/* Animated background */}

      <PanelTitle title="নম্বারভিত্তিক ব্যালেন্স" icon={<CiMoneyCheck1 />} />

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
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 text-right rounded-r-xl">
                ব্যালেন্স
              </th>
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody>
            {numbers.map((n, index) => (
              <tr
                key={n.id}
                className="rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-100/50 dark:border-gray-700/50 hover:shadow-lg group"
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
                  {n.kind}
                </td>
                <td className="p-4 text-right font-bold text-gray-900 dark:text-white rounded-r-xl">
                  <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10">
                    ৳{fmtBDT(balances[n.id] || 0)}
                  </span>
                </td>
              </tr>
            ))}

            {numbers.length === 0 && (
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

      {/* Floating decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10 blur-2xl group-hover:scale-110 transition-transform duration-500" />
    </div>
  );
}

function ActivityLog({ logs }) {
  return (
    <div className="group relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-lg p-8 shadow-md border border-gray-300 border-b-transparent dark:border-gray-800/20 transition-all duration-300">
      {/* Animated background */}
      {/* <div className="absolute inset-0 bg-gradient-to-bl from-[#009C91]/5 to-[#862C8A]/5 group-hover:from-[#009C91]/10 group-hover:to-[#862C8A]/10 transition-all duration-500" /> */}

      <PanelTitle title="লগ" icon="📝" />

      <div className="mt-6 max-h-80 overflow-y-auto pr-2">
        <div className="space-y-3">
          {logs
            .slice()
            .reverse()
            .map((l, index) => (
              <div
                key={l.id}
                className="group/log flex gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-100/50 dark:border-gray-700/50 hover:shadow-md"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-[#009C91] to-[#862C8A] group-hover/log:animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {new Date(l.ts).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium break-words">
                    {l.msg}
                  </div>
                </div>
              </div>
            ))}

          {logs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#009C91]/20 to-[#862C8A]/20 flex items-center justify-center">
                <span className="text-2xl opacity-60">📝</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">
                কোন লগ নেই
              </div>
            </div>
          )}
        </div>
      </div>

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

function EmptyState({ title, desc }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4 text-center py-12">
      <div className="relative">
        <div className="h-16 w-16 rounded-3xl bg-gradient-to-r from-[#862C8A] to-[#009C91] opacity-90 flex items-center justify-center">
          <div className="w-8 h-8 rounded-2xl bg-white/30 animate-pulse" />
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#862C8A]/20 to-[#009C91]/20 blur-xl animate-pulse" />
      </div>
      <div className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </div>
      {desc && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  );
}
