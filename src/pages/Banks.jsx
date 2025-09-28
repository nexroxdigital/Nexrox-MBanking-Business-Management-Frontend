import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { BankTxnColumns } from "../components/columns/BankTxnColumns";
import TableComponent from "../components/shared/Table/Table";
import { fmtBDT, todayISO } from "./utils";

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const BankTransactions = () => {
  const [banks, setBanks] = useState([
    {
      id: 1,
      bank: "ডাচ্-বাংলা ব্যাংক",
      branch: "ঢাকা",
      routingNo: "12345",
      senderName: "রাকিব",
      accountName: "রাকিবুল হাসান",
      accountNumber: "1234567890",
      balance: 100000,
    },
  ]);

  const [transactions, setTransactions] = useState([
    {
      date: todayISO(),
      time: getCurrentTime(),
      bank: "ডাচ্-বাংলা ব্যাংক",
      branch: "ঢাকা",
      senderName: "সাকিব",
      receiverName: "সাকিবুল হাসান",
      amount: 50000,
      fee: 200,
      pay: 49800,
    },
    {
      date: todayISO(),
      time: getCurrentTime(),
      bank: "ডাচ্-বাংলা ব্যাংক",
      branch: "ঢাকা",
      senderName: "সাকিব",
      receiverName: "সাকিবুল হাসান",
      amount: 50000,
      fee: 200,
      pay: 49800,
    },
  ]);

  const [showBankModal, setShowBankModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const bankForm = useForm({
    defaultValues: {
      bank: "",
      branch: "",
      routingNo: "",
      senderName: "",
      accountName: "",
      accountNumber: "",
      balance: "",
    },
  });

  const editForm = useForm({
    defaultValues: {
      bank: "",
      branch: "",
      routingNo: "",
      senderName: "",
      accountName: "",
      accountNumber: "",
      balance: "",
    },
  });

  const txnForm = useForm({
    defaultValues: {
      date: todayISO(),
      time: getCurrentTime(),
      bank: "",
      branch: "",
      senderName: "",
      receiverName: "",
      amount: "",
      fee: "",
      pay: "",
    },
  });

  const handleAddBank = (data) => {
    setBanks([...banks, data]);
    bankForm.reset();
    setShowBankModal(false);
  };

  const handleEditBank = (data) => {
    const updatedBanks = [...banks];
    updatedBanks[editIndex] = data;
    setBanks(updatedBanks);
    editForm.reset();
    setShowEditModal(false);
  };

  const handleDeleteBank = (id) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ব্যাংকটি ডিলিট করা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedBanks = banks.filter((b) => b.id !== id);
        setBanks(updatedBanks);

        Swal.fire({
          title: "ডিলিট হয়েছে!",
          text: "ব্যাংকটি সফলভাবে ডিলিট হয়েছে।",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleAddTransaction = (data) => {
    setTransactions([...transactions, data]);
    txnForm.reset({
      date: todayISO(),
      time: getCurrentTime(),
      bank: "",
      branch: "",
      senderName: "",
      receiverName: "",
      amount: "",
      fee: "",
      pay: "",
    });
    setShowTxnModal(false);
  };

  // Dropdown helpers
  const bankNames = [...new Set(banks.map((b) => b.bank))];
  const getBranches = (bankName) => [
    ...new Set(banks.filter((b) => b.bank === bankName).map((b) => b.branch)),
  ];
  const getSenders = (bankName, branch) => [
    ...new Set(
      banks
        .filter((b) => b.bank === bankName && b.branch === branch)
        .map((b) => b.senderName)
    ),
  ];

  return (
    <div className="mt-10">
      <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
      <div className=" bg-white shadow-2xl rounded-2xl rounded-tr-none rounded-tl-none p-6 space-y-10 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
          <h1 className="text-lg md:text-3xl font-extrabold text-gray-900 tracking-tight">
            ব্যাংক ট্রানজেকশন
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBankModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              + নতুন ব্যাংক যোগ করুন
            </button>
            <button
              onClick={() => setShowTxnModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              + নতুন ট্রানজেকশন
            </button>
          </div>
        </div>

        {/* Bank List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {banks.map((b, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 font-medium relative"
            >
              <span className="font-bold text-2xl text-gray-900">{b.bank}</span>
              <span className="block text-gray-700 mt-2">শাখা: {b.branch}</span>
              <span className="block text-gray-700">
                অ্যাকাউন্ট: {b.accountNumber}
              </span>
              <span className="block text-sm text-gray-500 mt-1">
                হোল্ডার: {b.accountName}
              </span>
              <span className="block text-sm text-gray-600 mt-1">
                ব্যালেন্স: ৳{fmtBDT(b.balance)}
              </span>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditIndex(i);
                    editForm.reset(b);
                    setShowEditModal(true);
                  }}
                  className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handleDeleteBank(b.id)}
                  className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  ডিলিট
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Bank Modal */}
        {showBankModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">নতুন ব্যাংক যোগ করুন</h2>
              <form
                onSubmit={bankForm.handleSubmit(handleAddBank)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="ব্যাংকের নাম"
                  className="w-full border rounded-lg p-3"
                  {...bankForm.register("bank", { required: true })}
                />
                <input
                  type="text"
                  placeholder="শাখা"
                  className="w-full border rounded-lg p-3"
                  {...bankForm.register("branch", { required: true })}
                />
                <input
                  type="text"
                  placeholder="Routing No"
                  className="w-full border rounded-lg p-3"
                  {...bankForm.register("routingNo", { required: true })}
                />
                <input
                  type="text"
                  placeholder="প্রেরকের নাম"
                  className="w-full border rounded-lg p-3"
                  {...bankForm.register("senderName", { required: true })}
                />
                <input
                  type="text"
                  placeholder="অ্যাকাউন্ট নাম"
                  className="w-full border rounded-lg p-3"
                  {...bankForm.register("accountName", { required: true })}
                />
                <input
                  type="text"
                  placeholder="অ্যাকাউন্ট নাম্বার"
                  className="w-full border rounded-lg p-3"
                  {...bankForm.register("accountNumber", { required: true })}
                />
                <input
                  type="number"
                  placeholder="ব্যালেন্স"
                  className="w-full border rounded-lg p-3"
                  {...bankForm.register("balance", { required: true })}
                />
                <div className="col-span-full flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBankModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Bank Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">ব্যাংক এডিট করুন</h2>
              <form
                onSubmit={editForm.handleSubmit(handleEditBank)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("bank", { required: true })}
                />
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("branch", { required: true })}
                />
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("routingNo", { required: true })}
                />
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("senderName", { required: true })}
                />
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("accountName", { required: true })}
                />
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("accountNumber", { required: true })}
                />
                <input
                  type="number"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("balance", { required: true })}
                />
                <div className="col-span-full flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    আপডেট করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showTxnModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">
                নতুন ট্রানজেকশন যোগ করুন
              </h2>
              <form
                onSubmit={txnForm.handleSubmit(handleAddTransaction)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <input
                  type="date"
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("date", { required: true })}
                />
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 bg-gray-100"
                  readOnly
                  value={getCurrentTime()}
                  {...txnForm.register("time")}
                />
                <select
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("bank", { required: true })}
                >
                  <option value="">ব্যাংক নির্বাচন করুন</option>
                  {bankNames.map((name, i) => (
                    <option key={i} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("branch", { required: true })}
                >
                  <option value="">শাখা নির্বাচন করুন</option>
                  {getBranches(txnForm.watch("bank")).map((branch, i) => (
                    <option key={i} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("senderName", { required: true })}
                >
                  <option value="">প্রেরক নির্বাচন করুন</option>
                  {getSenders(
                    txnForm.watch("bank"),
                    txnForm.watch("branch")
                  ).map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="গ্রাহক"
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("receiverName", { required: true })}
                />
                <input
                  type="number"
                  placeholder="পরিমাণ"
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("amount", { required: true })}
                />
                <input
                  type="number"
                  placeholder="ফি"
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("fee", { required: true })}
                />
                <input
                  type="number"
                  placeholder="পে"
                  className="w-full border rounded-lg p-3"
                  {...txnForm.register("pay", { required: true })}
                />
                <div className="col-span-full flex gap-3">
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
        {/* <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
          <table className="w-full text-sm md:text-base border border-gray-200">
            <thead className="bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white">
              <tr>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  তারিখ
                </th>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  সময়
                </th>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  ব্যাংক
                </th>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  শাখা
                </th>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  প্রেরক
                </th>
                <th className="p-4 text-left font-semibold border border-gray-200">
                  গ্রাহক
                </th>
                <th className="p-4 text-right font-semibold border border-gray-200">
                  পরিমাণ
                </th>
                <th className="p-4 text-right font-semibold border border-gray-200">
                  ফি
                </th>
                <th className="p-4 text-right font-semibold border border-gray-200">
                  পে
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
                  <td className="p-4 border border-gray-200">{txn.time}</td>
                  <td className="p-4 border border-gray-200">{txn.bank}</td>
                  <td className="p-4 border border-gray-200">{txn.branch}</td>
                  <td className="p-4 border border-gray-200">
                    {txn.senderName}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {txn.receiverName}
                  </td>
                  <td className="p-4 border border-gray-200 text-right">
                    ৳{fmtBDT(txn.amount)}
                  </td>
                  <td className="p-4 border border-gray-200 text-right text-purple-600 font-medium">
                    ৳{fmtBDT(txn.fee)}
                  </td>
                  <td className="p-4 border border-gray-200 text-right text-green-600 font-semibold">
                    ৳{fmtBDT(txn.pay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        <TableComponent data={transactions} columns={BankTxnColumns} />
      </div>
    </div>
  );
};

export default BankTransactions;
