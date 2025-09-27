import { useState } from "react";
import { useForm } from "react-hook-form";
import { fmtBDT, todayISO } from "./utils";

const MobileRecharge = () => {
  const [operators, setOperators] = useState([
    { name: "রবি", number: "016XXXXXXXX" },
    { name: "গ্রামীণফোন", number: "017XXXXXXXX" },
    { name: "বাংলালিংক", number: "019XXXXXXXX" },
  ]);

  const [transactions, setTransactions] = useState([
    {
      date: todayISO(),
      senderNo: "017XXXXXXXX",
      receiverNo: "018XXXXXXXX",
      pay: 100,
      balance: 900,
    },
    {
      date: todayISO(),
      senderNo: "017XXXXXXXX",
      receiverNo: "018XXXXXXXX",
      pay: 100,
      balance: 900,
    },
  ]);

  const [showTxnModal, setShowTxnModal] = useState(false);
  const [showOperatorModal, setShowOperatorModal] = useState(false);

  const rechargeForm = useForm({
    defaultValues: {
      date: todayISO(),
      senderNo: "",
      receiverNo: "",
      pay: "",
      balance: "",
    },
  });

  const operatorForm = useForm({
    defaultValues: {
      name: "",
      number: "",
    },
  });

  const handleAddRecharge = (data) => {
    setTransactions([...transactions, data]);
    rechargeForm.reset({
      date: todayISO(),
      senderNo: "",
      receiverNo: "",
      pay: "",
      balance: "",
    });
    setShowTxnModal(false);
  };

  const handleAddOperator = (data) => {
    setOperators([...operators, data]);
    operatorForm.reset();
    setShowOperatorModal(false);
  };

  return (
    <div className="mt-10">
      <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
      <div className="bg-white shadow-2xl rounded-2xl p-6 rounded-tr-none rounded-tl-none space-y-10 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
          <h1 className="text-lg md:text-3xl font-extrabold text-gray-900 tracking-tight">
            মোবাইল রিচার্জ হিস্টোরি
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowOperatorModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              + নতুন অপারেটর
            </button>
            <button
              onClick={() => setShowTxnModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              + নতুন রিচার্জ
            </button>
          </div>
        </div>

        {/* Operators List */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {operators.map((op, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-gray-900">{op.name}</h3>
              <p className="text-gray-700 mt-2">{op.number}</p>
            </div>
          ))}
        </div> */}

        {/* Operators List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {operators.map((op, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#009C91] transition transform hover:-translate-y-1 flex flex-col items-start"
            >
              {/* Operator Header */}
              <div className="flex items-center justify-between w-full">
                <h3 className="text-xl font-bold text-gray-900">{op.name}</h3>
                {/* <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" /> */}
              </div>

              {/* Number */}
              <p className="mt-3 text-gray-700 text-lg font-mono tracking-wide">
                {op.number}
              </p>

              {/* Subtle Accent Divider */}
              <div className="mt-4 w-full h-px bg-gradient-to-r from-gray-200 to-gray-100 group-hover:from-[#862C8A] group-hover:to-[#009C91] transition" />
            </div>
          ))}
        </div>

        {/* Add Operator Modal */}
        {showOperatorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">নতুন অপারেটর যোগ করুন</h2>
              <form
                onSubmit={operatorForm.handleSubmit(handleAddOperator)}
                className="grid grid-cols-1 gap-4"
              >
                <input
                  type="text"
                  placeholder="অপারেটরের নাম (রবি, গ্রামীণফোন ইত্যাদি)"
                  className="w-full border rounded-lg p-3"
                  {...operatorForm.register("name", { required: true })}
                />
                <input
                  type="text"
                  placeholder="নম্বর"
                  className="w-full border rounded-lg p-3"
                  {...operatorForm.register("number", { required: true })}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOperatorModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Recharge Modal */}
        {showTxnModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">নতুন রিচার্জ যোগ করুন</h2>
              <form
                onSubmit={rechargeForm.handleSubmit(handleAddRecharge)}
                className="grid grid-cols-1 gap-4"
              >
                <input
                  type="date"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("date", { required: true })}
                />
                <select
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("senderNo", { required: true })}
                >
                  <option value="">অপারেটর নাম্বার নির্বাচন করুন</option>
                  {operators.map((op, i) => (
                    <option key={i} value={op.number}>
                      {op.name} - {op.number}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="রিসিভার নাম্বার"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("receiverNo", { required: true })}
                />
                <input
                  type="number"
                  placeholder="পে"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("pay", { required: true })}
                />
                <input
                  type="number"
                  placeholder="ব্যালেন্স"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("balance", { required: true })}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTxnModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
          <table className="w-full text-sm md:text-base border border-gray-200">
            <thead className="bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white">
              <tr>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  তারিখ
                </th>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  প্রেরক নাম্বার
                </th>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  রিসিভার নাম্বার
                </th>
                <th className="p-4 text-right font-semibold border border-gray-200">
                  পে
                </th>
                <th className="p-4 text-right font-semibold border border-gray-200">
                  ব্যালেন্স
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
                  <td className="p-4 border border-gray-200">{txn.senderNo}</td>
                  <td className="p-4 border border-gray-200">
                    {txn.receiverNo}
                  </td>
                  <td className="p-4 border border-gray-200 text-right">
                    ৳{fmtBDT(txn.pay)}
                  </td>
                  <td className="p-4 border border-gray-200 text-right text-green-600 font-semibold">
                    ৳{fmtBDT(txn.balance)}
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

export default MobileRecharge;
