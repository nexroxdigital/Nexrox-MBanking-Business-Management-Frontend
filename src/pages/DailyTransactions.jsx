import { useState } from "react";
import { fmtBDT, todayISO } from "./utils";

const DailyTransactions = () => {
  const [transactions, setTransactions] = useState([
    {
      date: "2025-09-27",
      item: "গ্যাস বিল",
      method: "Rocket",
      pay: 100,
      fee: 20,
      cost: 20,
      refund: 80,
      profit: 20,
    },
    {
      date: "2025-09-27",
      item: "ইন্টারনেট বিল",
      method: "Bkash",
      pay: 200,
      fee: 30,
      cost: 50,
      refund: 150,
      profit: 50,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTxn, setNewTxn] = useState({
    date: todayISO(),
    item: "",
    method: "",
    pay: "",
    fee: "",
    cost: "",
    refund: "",
    profit: "",
  });

  const methods = ["Bkash", "Nagad", "Rocket", "Cash"];

  const handleAddTransaction = () => {
    setTransactions([...transactions, newTxn]);
    setNewTxn({
      date: "",
      item: "",
      method: "",
      pay: "",
      fee: "",
      cost: "",
      refund: "",
      profit: "",
    });
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">দৈনিক লেনদেন</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white shadow-md"
          >
            + নতুন লেনদেন
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                নতুন লেনদেন যোগ করুন
              </h2>
              <div className="space-y-4">
                <input
                  type="date"
                  className="w-full border rounded p-2"
                  value={newTxn.date}
                  onChange={(e) =>
                    setNewTxn({ ...newTxn, date: e.target.value })
                  }
                />
                <select
                  className="w-full border rounded p-2"
                  value={newTxn.method}
                  onChange={(e) =>
                    setNewTxn({
                      ...newTxn,
                      method: e.target.value,
                      item:
                        e.target.value !== "অন্যান্য আইটেম"
                          ? e.target.value
                          : "",
                    })
                  }
                >
                  <option value="">মেথড নির্বাচন করুন</option>
                  {methods.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {newTxn.method === "অন্যান্য আইটেম" && (
                  <input
                    type="text"
                    placeholder="আইটেমের নাম লিখুন"
                    className="w-full border rounded p-2"
                    value={newTxn.item}
                    onChange={(e) =>
                      setNewTxn({ ...newTxn, item: e.target.value })
                    }
                  />
                )}
                <input
                  type="number"
                  placeholder="টাকা"
                  className="w-full border rounded p-2"
                  value={newTxn.pay}
                  onChange={(e) =>
                    setNewTxn({ ...newTxn, pay: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="ফি"
                  className="w-full border rounded p-2"
                  value={newTxn.fee}
                  onChange={(e) =>
                    setNewTxn({ ...newTxn, fee: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="খরচ"
                  className="w-full border rounded p-2"
                  value={newTxn.cost}
                  onChange={(e) =>
                    setNewTxn({ ...newTxn, cost: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="রিফান্ড"
                  className="w-full border rounded p-2"
                  value={newTxn.refund}
                  onChange={(e) =>
                    setNewTxn({ ...newTxn, refund: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="লাভ"
                  className="w-full border rounded p-2"
                  value={newTxn.profit}
                  onChange={(e) =>
                    setNewTxn({ ...newTxn, profit: e.target.value })
                  }
                />
                <button
                  onClick={handleAddTransaction}
                  className="w-full py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 rounded-md border mt-2"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm md:text-base border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left font-semibold border border-gray-200">
                  তারিখ
                </th>
                <th className="p-3 text-left font-semibold border border-gray-200">
                  আইটেম
                </th>
                <th className="p-3 text-left font-semibold border border-gray-200">
                  মেথড
                </th>
                <th className="p-3 text-right font-semibold border border-gray-200">
                  টাকা
                </th>
                <th className="p-3 text-right font-semibold border border-gray-200">
                  ফি
                </th>
                <th className="p-3 text-right font-semibold border border-gray-200">
                  খরচ
                </th>
                <th className="p-3 text-right font-semibold border border-gray-200">
                  রিফান্ড
                </th>
                <th className="p-3 text-right font-semibold border border-gray-200">
                  লাভ
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr
                  key={index}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="p-3 border border-gray-200">{txn.date}</td>
                  <td className="p-3 border border-gray-200">{txn.item}</td>
                  <td className="p-3 border border-gray-200">{txn.method}</td>
                  <td className="p-3 border border-gray-200 text-right">
                    ৳{fmtBDT(txn.pay)}
                  </td>
                  <td className="p-3 border border-gray-200 text-right">
                    ৳{fmtBDT(txn.fee)}
                  </td>
                  <td className="p-3 border border-gray-200 text-right">
                    ৳{fmtBDT(txn.cost)}
                  </td>
                  <td className="p-3 border border-gray-200 text-right">
                    ৳{fmtBDT(txn.refund)}
                  </td>
                  <td className="p-3 border border-gray-200 text-right font-semibold text-green-600">
                    ৳{fmtBDT(txn.profit)}
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

export default DailyTransactions;
