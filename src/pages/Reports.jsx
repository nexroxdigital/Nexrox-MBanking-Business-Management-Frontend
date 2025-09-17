import { useMemo, useState } from "react";
import { StatCard } from "./Dashbaord";
import {
  computeClientStats,
  computeSums,
  daysAgo,
  fmtBDT,
  todayISO,
} from "./utils";

export default function Reports({ ctx }) {
  const { state } = ctx;
  const [range, setRange] = useState({ from: daysAgo(30), to: todayISO() });
  const sums = useMemo(
    () => computeSums(state.transactions, state.clients),
    [state.transactions, state.clients]
  );

  const byNumber = useMemo(() => {
    const out = {};
    state.transactions.forEach((t) => {
      if (t.date < range.from || t.date > range.to) return;
      out[t.numberLabel] = out[t.numberLabel] || { amount: 0, count: 0 };
      out[t.numberLabel].amount += Number(t.amount || 0);
      out[t.numberLabel].count += 1;
    });
    return out;
  }, [state.transactions, range]);

  const dayKeyed = useMemo(() => {
    const out = {};
    for (let i = 0; i < 30; i++) {
      const d = daysAgo(29 - i);
      out[d] = { sell: 0, profit: 0, due: 0 };
    }
    state.transactions.forEach((t) => {
      if (t.date < range.from || t.date > range.to) return;
      out[t.date] = out[t.date] || { sell: 0, profit: 0, due: 0 };
      out[t.date].sell += Number(t.amount || 0);
      out[t.date].profit += Number(t.commission || 0);
    });
    // due by day is approximated as total client due snapshot on that date (simple)
    const clientStats = computeClientStats(state);
    Object.keys(out).forEach((d) => {
      out[d].due = clientStats.totalDue; // simplistic snapshot
    });
    return out;
  }, [state.transactions, state.clients, range, state]);

  const today = todayISO();
  const todayRow = sums.byDay[today] || { sell: 0, profit: 0, due: 0 };

  return (
    <section className="grid md:grid-cols-5 gap-6 mt-10">
      {/* Top Stats */}
      <div className="md:col-span-5 grid md:grid-cols-3 gap-4">
        <StatCard
          title="আজকের বিক্রি"
          value={`৳${fmtBDT(todayRow.sell)}`}
          sub={today}
          icon=""
          gradient="from-[#862C8A] to-[#009C91]"
        />
        <StatCard
          title="আজকের লাভ"
          value={`৳${fmtBDT(todayRow.profit)}`}
          sub={today}
          icon=""
          gradient="from-[#862C8A] to-[#009C91]"
        />
        <StatCard
          title="আজকের পাওনা"
          value={`৳${fmtBDT(todayRow.due)}`}
          sub={today}
          icon=""
          gradient="from-[#862C8A] to-[#009C91]"
        />
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
          <h3 className="font-semibold text-white">সারসংক্ষেপ (শেষ ৩০ দিন)</h3>
          <span className="text-xs px-2 py-1 rounded-lg bg-white/15 text-white/90">
            From {range.from} to {range.to}
          </span>
        </div>

        <div className="p-5">
          <div
            className="rounded-xl  overflow-x-auto"
            style={{
              borderImageSlice: 1,
              borderImageSource:
                "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
            }}
          >
            <table className="w-full text-sm table-fixed border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left">
                  <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur sticky top-0 rounded-l-xl">
                    তারিখ
                  </th>
                  <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur">
                    বিক্রি
                  </th>
                  <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur">
                    লাভ
                  </th>
                  <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur rounded-r-xl">
                    পাওনা (স্ন্যাপশট)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dayKeyed)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([d, v]) => (
                    <tr
                      key={d}
                      className="group rounded-xl border border-gray-100 bg-white hover:shadow-sm transition"
                    >
                      <td className="py-2 px-4 rounded-l-xl">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-1.5 h-5 rounded-full"
                            style={{
                              background:
                                "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                            }}
                          />
                          <span>{d}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-right text-gray-800">
                        ৳{fmtBDT(v.sell)}
                      </td>
                      <td className="py-2 px-4 text-right text-gray-800">
                        <span
                          className="px-2 py-0.5 rounded-md font-semibold text-gray-900"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                          }}
                        >
                          ৳{fmtBDT(v.profit)}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right rounded-r-xl">
                        <span
                          className="px-2.5 py-1 rounded-lg font-semibold text-gray-900"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                          }}
                        >
                          ৳{fmtBDT(v.due)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Number-wise Report */}
      <div className="md:col-span-2 rounded-2xl border border-gray-300 shadow-sm overflow-hidden bg-white">
        {/* Gradient Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        >
          <h3 className="font-semibold text-white">নম্বারভিত্তিক রিপোর্ট</h3>
          <span className="text-xs px-2 py-1 rounded-lg bg-white/15 text-white/90">
            Top Channels
          </span>
        </div>

        <div className="p-5">
          <div
            className="rounded-xl overflow-x-auto"
            style={{
              borderImageSlice: 1,
              borderImageSource:
                "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
            }}
          >
            <table className="w-full text-sm table-fixed border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left">
                  <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur sticky top-0 rounded-l-xl">
                    নম্বর
                  </th>
                  <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur">
                    লেনদেন
                  </th>
                  <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur rounded-r-xl">
                    মোট
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byNumber).map(([k, v]) => (
                  <tr
                    key={k}
                    className="group rounded-xl border border-gray-100 bg-white hover:shadow-sm transition"
                  >
                    <td className="py-2 px-4 rounded-l-xl">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          }}
                        />
                        <span className="truncate" title={k}>
                          {k}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right text-gray-800">
                      {v.count}
                    </td>
                    <td className="py-2 px-4 text-right rounded-r-xl">
                      <span
                        className="px-2.5 py-1 rounded-lg font-semibold text-gray-900"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                        }}
                      >
                        ৳{fmtBDT(v.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
                {Object.keys(byNumber).length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400">
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
      </div>
    </section>
  );
}
