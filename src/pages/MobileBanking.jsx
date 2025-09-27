import { useState } from "react";
import Settings from "./Settings";
import { fmtBDT, todayISO } from "./utils";

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MobileBanking = ({ ctx }) => {
  const [wallets] = useState([
    { bank: "বিকাশ", number: "017XXXXXXXX", type: "এজেন্ট" },
    { bank: "নগদ", number: "018XXXXXXXX", type: "পার্সোনাল" },
    { bank: "রকেট", number: "019XXXXXXXX", type: "এজেন্ট" },
  ]);

  const [transactions] = useState([
    {
      date: todayISO(),
      sender: "017XXXXXXXX",
      receiver: "018XXXXXXXX",
      ref: "REF123",
      trxId: "TRX001",
      time: getCurrentTime(),
      amount: 1000,
      commission: 20,
      pay: 980,
      method: "ক্যাশ",
    },
    {
      date: todayISO(),
      sender: "017XXXXXXXX",
      receiver: "018XXXXXXXX",
      ref: "REF123",
      trxId: "TRX001",
      time: getCurrentTime(),
      amount: 1000,
      commission: 20,
      pay: 980,
      method: "ক্যাশ",
    },
  ]);

  const [showSetting, setShowSetting] = useState(false);

  return (
    <div className="mt-10">
      <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
      <div className="bg-white shadow-2xl rounded-2xl p-6 rounded-tr-none rounded-tl-none space-y-10 border border-gray-100">
        {/* Conditional Rendering */}
        {showSetting ? (
          <Settings ctx={ctx} onClose={() => setShowSetting(false)} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                মোবাইল ব্যাংকিং
              </h1>
              <button
                onClick={() => setShowSetting(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold shadow hover:scale-105 transition"
              >
                নম্বর সেটিং
              </button>
            </div>

            {/* Wallets List */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {wallets.map((w, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  {/* Top Section with Bank Name */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      {w.bank}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        w.type === "এজেন্ট"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {w.type}
                    </span>
                  </div>

                  {/* Number */}
                  <p className="mt-4 text-gray-800 text-lg font-mono tracking-wide">
                    {w.number}
                  </p>

                  {/* Accent line */}
                  <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-[#862C8A] group-hover:to-[#009C91] transition" />
                </div>
              ))}
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
              <table className="w-full text-sm md:text-base border border-gray-200">
                <thead className="bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold border border-gray-200">
                      তারিখ
                    </th>
                    <th className="p-4 text-left font-semibold border border-gray-200">
                      প্রেরক
                    </th>
                    <th className="p-4 text-left font-semibold border border-gray-200">
                      গ্রাহক
                    </th>
                    <th className="p-4 text-left font-semibold border border-gray-200">
                      রেফারেন্স
                    </th>
                    <th className="p-4 text-left font-semibold border border-gray-200">
                      ট্রানজেকশন আইডি
                    </th>
                    <th className="p-4 text-left font-semibold border border-gray-200">
                      সময়
                    </th>
                    <th className="p-4 text-right font-semibold border border-gray-200">
                      পরিমাণ
                    </th>
                    <th className="p-4 text-right font-semibold border border-gray-200">
                      কমিশন
                    </th>
                    <th className="p-4 text-right font-semibold border border-gray-200">
                      পে
                    </th>
                    <th className="p-4 text-left font-semibold border border-gray-200">
                      মেথড
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, i) => (
                    <tr
                      key={i}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <td className="p-4 border border-gray-200">{txn.date}</td>
                      <td className="p-4 border border-gray-200">
                        {txn.sender}
                      </td>
                      <td className="p-4 border border-gray-200">
                        {txn.receiver}
                      </td>
                      <td className="p-4 border border-gray-200">{txn.ref}</td>
                      <td className="p-4 border border-gray-200">
                        {txn.trxId}
                      </td>
                      <td className="p-4 border border-gray-200">{txn.time}</td>
                      <td className="p-4 border border-gray-200 text-right">
                        ৳{fmtBDT(txn.amount)}
                      </td>
                      <td className="p-4 border border-gray-200 text-right text-purple-600 font-medium">
                        ৳{fmtBDT(txn.commission)}
                      </td>
                      <td className="p-4 border border-gray-200 text-right text-green-600 font-semibold">
                        ৳{fmtBDT(txn.pay)}
                      </td>
                      <td className="p-4 border border-gray-200">
                        {txn.method}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileBanking;
