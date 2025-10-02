import { useState } from "react";
import { ReportColumns } from "../components/columns/ReportColumns";
import TableComponent from "../components/shared/Table/Table";
import { reportData } from "../data/reportData";
import { StatCard } from "./Dashbaord";
import { daysAgo, fmtBDT, todayISO } from "./utils";

export default function Reports() {
  const [range, setRange] = useState({ from: daysAgo(30), to: todayISO() });
  const todayStats = [
    {
      title: "আজকের বিক্রি",
      value: "৳12,500",
      sub: "29-09-2023",
      icon: "",
      gradient: "from-[#862C8A] to-[#009C91]",
    },
    {
      title: "আজকের লাভ",
      value: "৳2,300",
      sub: "29-09-2023",
      icon: "",
      gradient: "from-[#862C8A] to-[#009C91]",
    },
    {
      title: "আজকের পাওনা",
      value: "৳8,700",
      sub: "29-09-2023",
      icon: "",
      gradient: "from-[#862C8A] to-[#009C91]",
    },
  ];

  const numberSummary = [
    {
      number: "Bkash Agent 01",
      amount: 84747,
      count: 4,
    },
    {
      number: "Bkash Agent 02",
      amount: 65320,
      count: 3,
    },
    {
      number: "Nagad Agent 01",
      amount: 42100,
      count: 2,
    },
    {
      number: "Rocket Agent 01",
      amount: 37250,
      count: 5,
    },
    {
      number: "Bkash Personal 01",
      amount: 15980,
      count: 1,
    },
  ];

  const today = todayISO();

  return (
    <section className="grid md:grid-cols-5 gap-6 mt-10">
      {/* Top Stats */}
      <div className="md:col-span-5 grid md:grid-cols-3 gap-4">
        {todayStats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            sub={stat.sub}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
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
          <TableComponent
            data={reportData}
            columns={ReportColumns}
            pagination=""
            setPagination=""
            pageCount=""
            isFetching={false}
            isLoading={false}
          />
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
        </div>

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
              <thead className="bg-[#66196c9c]">
                <tr className="text-left border-0 border-b border-b-gray-400">
                  <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur sticky top-0 border-0 border-r border-r-gray-400">
                    নম্বর
                  </th>
                  <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur border-0 border-r border-r-gray-400">
                    লেনদেন
                  </th>
                  <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur">
                    মোট
                  </th>
                </tr>
              </thead>
              <tbody>
                {numberSummary.map((n) => (
                  <tr
                    key={n.number}
                    className="group rounded-xl border border-gray-100 bg-white hover:shadow-sm transition"
                  >
                    <td className="py-2 px-4 rounded-l-xl border-0 border-r border-r-gray-400 border-b border-b-gray-200">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          }}
                        />
                        <span className="truncate" title={n.number}>
                          {n.number}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right text-gray-800 border-0 border-r border-r-gray-400 border-b border-b-gray-200">
                      {n.count}
                    </td>
                    <td className="py-2 px-4 text-right rounded-r-xl border-b border-b-gray-200">
                      <span
                        className="px-2.5 py-1 rounded-lg font-semibold text-gray-900"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                        }}
                      >
                        ৳{fmtBDT(n.amount)}
                      </span>
                    </td>
                  </tr>
                ))}

                {numberSummary.length === 0 && (
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
