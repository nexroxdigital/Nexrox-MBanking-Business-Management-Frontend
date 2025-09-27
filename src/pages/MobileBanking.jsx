import { useState } from "react";
import { fmtBDT, todayISO } from "./utils";

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MobileBanking = () => {
  const [wallets] = useState([
    { bank: "বিকাশ", number: "017XXXXXXXX", type: "এজেন্ট" },
    { bank: "নগদ", number: "018XXXXXXXX", type: "ব্যক্তিগত" },
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
  ]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className=" bg-white shadow-2xl rounded-2xl p-8 space-y-10 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            📱 মোবাইল ব্যাংকিং
          </h1>
        </div>

        {/* Wallets List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {wallets.map((w, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <span className="font-bold text-2xl text-gray-900">{w.bank}</span>
              <span className="block text-gray-700 mt-2 text-lg">
                {w.number}
              </span>
              <span className="block text-sm text-gray-500 mt-1">
                ধরণ: {w.type}
              </span>
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
                  <td className="p-4 border border-gray-200">{txn.sender}</td>
                  <td className="p-4 border border-gray-200">{txn.receiver}</td>
                  <td className="p-4 border border-gray-200">{txn.ref}</td>
                  <td className="p-4 border border-gray-200">{txn.trxId}</td>
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
                  <td className="p-4 border border-gray-200">{txn.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MobileBanking;
