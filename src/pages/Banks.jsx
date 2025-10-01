import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { BankTxnColumns } from "../components/columns/BankTxnColumns";
import TableComponent from "../components/shared/Table/Table";
import {
  useAddNewBank,
  useAdjustBankBalance,
  useBanks,
  useDeleteBank,
  useUpdateBank,
} from "../hooks/useBank";
import { fmtBDT, todayISO } from "./utils";

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const BankTransactions = () => {
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [balanceValue, setBalanceValue] = useState("");

  const addNewBankMutation = useAddNewBank();
  const deleteBankMutation = useDeleteBank();
  const updateBankMutation = useUpdateBank();
  const adjustBankBalanceMutation = useAdjustBankBalance();

  const { data, isLoading, isError } = useBanks();

  const [banks, setBanks] = useState([]);

  // sync query data into local state
  useEffect(() => {
    if (Array.isArray(data)) {
      setBanks(data);
    } else {
      setBanks([]); // fallback to empty array
    }
  }, [data]);

  const [transactions, setTransactions] = useState([
    {
      date: todayISO(),
      time: getCurrentTime(),
      bank: "ডাচ্-বাংলা ব্যাংক",
      branch: "ঢাকা",
      accountName: "সাকিব",
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
      accountName: "সাকিব",
      receiverName: "সাকিবুল হাসান",
      amount: 50000,
      fee: 200,
      pay: 49800,
    },
  ]);

  const [showBankModal, setShowBankModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const bankForm = useForm({
    defaultValues: {
      bank: "",
      branch: "",
      routingNo: "",
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
    const newBank = {
      ...data,
      balance: Number(data.balance) || 0,
      _id: Date.now().toString(), // temporary id for optimistic UI
      optimistic: true,
    };

    //  Optimistic UI update
    setBanks((prev) => [...prev, newBank]);

    //  Call API
    addNewBankMutation.mutate(newBank, {
      onSuccess: (saved) => {
        // Replace the optimistic bank with the real one from server
        setBanks((prev) =>
          prev.map((b) => (b._id === newBank._id ? saved : b))
        );

        Swal.fire({
          title: "সফল",
          text: "ব্যাংক সফলভাবে যোগ হয়েছে!",
          icon: "success",
          showConfirmButton: false,
          timer: 1100,
        });
      },
      onError: () => {
        // Rollback UI
        setBanks((prev) => prev.filter((b) => b._id !== newBank._id));
        Swal.fire("ত্রুটি", "ব্যাংক যোগ ব্যর্থ হয়েছে", "error");
      },
      onSettled: () => {
        bankForm.reset();
        setShowBankModal(false);
      },
    });
  };

  const handleEditBank = (data) => {
    if (!editId) return;

    console.log("data", data);

    const updatedBank = { ...data, _id: editId };
    const prevBanks = [...banks];

    // Optimistic UI update
    setBanks((prev) => prev.map((b) => (b._id === editId ? updatedBank : b)));

    // 🔄 Call backend
    updateBankMutation.mutate(
      { id: editId, bankData: updatedBank },
      {
        onError: () => {
          // Rollback
          setBanks(prevBanks);
          Swal.fire("ত্রুটি", "ব্যাংক আপডেট ব্যর্থ হয়েছে!", "error");
        },
        onSuccess: (savedBank) => {
          // Replace optimistic with actual data
          setBanks((prev) =>
            prev.map((b) => (b._id === savedBank._id ? savedBank : b))
          );

          Swal.fire({
            title: "সফল",
            text: "ব্যাংক সফলভাবে আপডেট হয়েছে!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        },
        onSettled: () => {
          setShowEditModal(false);
          setEditId(null);
          editForm.reset();
        },
      }
    );
  };

  const handleDeleteBank = (id) => {
    const prevBanks = [...banks];

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
        // 🟢 Optimistic UI update
        setBanks((prev) => prev.filter((b) => b._id !== id));

        // 🔄 Call backend
        deleteBankMutation.mutate(id, {
          onError: () => {
            // ❌ Rollback on error
            setBanks(prevBanks);
            Swal.fire("ত্রুটি", "ব্যাংক ডিলিট ব্যর্থ হয়েছে!", "error");
          },
          onSuccess: () => {
            // ✅ Confirm success
            Swal.fire({
              title: "ডিলিট হয়েছে!",
              text: "ব্যাংকটি সফলভাবে ডিলিট হয়েছে।",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          },
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
      receiverName: "",
      amount: "",
      fee: "",
      pay: "",
    });
    setShowTxnModal(false);
  };

  const handleAdjustBalance = () => {
    const delta = Number(balanceValue || 0);
    if (!selectedBankId || isNaN(delta)) return;

    const prevBanks = [...banks]; // snapshot for rollback

    //  Optimistic UI update
    setBanks((prev) =>
      prev.map((b) =>
        b._id === selectedBankId
          ? { ...b, balance: (b.balance || 0) + delta }
          : b
      )
    );

    //  Call backend
    adjustBankBalanceMutation.mutate(
      { id: selectedBankId, amount: delta },
      {
        onError: () => {
          //  Rollback
          setBanks(prevBanks);
          Swal.fire("ত্রুটি", "ব্যালেন্স আপডেট ব্যর্থ হয়েছে!", "error");
        },
        onSuccess: () => {
          Swal.fire({
            title: "সফল",
            text: "ব্যালেন্স সফলভাবে আপডেট হয়েছে!",
            icon: "success",
            showConfirmButton: false,
            timer: 1200,
          });
        },
        onSettled: () => {
          setShowBalanceModal(false);
          setSelectedBankId("");
          setBalanceValue("");
        },
      }
    );
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
        .map((b) => b.accountName)
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
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition hover:bg-gradient-to-l cursor-pointer"
            >
              ব্যাংক যোগ করুন
            </button>
            <button
              onClick={() => setShowTxnModal(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition hover:bg-gradient-to-l cursor-pointer"
            >
              নতুন লেনদেন
            </button>

            <button
              onClick={() => {
                setShowBalanceModal(true);
                setSelectedBankId(banks[0]?._id || "");
                setBalanceValue("");
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition hover:bg-gradient-to-l cursor-pointer"
            >
              ব্যালেন্স যোগ করুন
            </button>
          </div>
        </div>

        {/* Bank List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {isLoading && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 font-medium relative">
              <span className="font-bold text-2xl text-gray-900">
                Loading...
              </span>
            </div>
          )}
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
                    setEditId(b._id);
                    editForm.reset(b);
                    setShowEditModal(true);
                  }}
                  className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handleDeleteBank(b._id)}
                  className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                >
                  ডিলিট
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Bank Modal */}
        {showBankModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 h-screen"
            onClick={() => setShowBankModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">নতুন ব্যাংক যোগ করুন</h2>
              <form
                onSubmit={bankForm.handleSubmit(handleAddBank)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ব্যাংকের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="ব্যাংকের নাম"
                    className="w-full border rounded-lg p-3"
                    {...bankForm.register("bank", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    শাখা
                  </label>
                  <input
                    type="text"
                    placeholder="শাখা"
                    className="w-full border rounded-lg p-3"
                    {...bankForm.register("branch", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing No
                  </label>
                  <input
                    type="text"
                    placeholder="Routing No"
                    className="w-full border rounded-lg p-3"
                    {...bankForm.register("routingNo", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    অ্যাকাউন্ট নাম
                  </label>
                  <input
                    type="text"
                    placeholder="অ্যাকাউন্ট নাম"
                    className="w-full border rounded-lg p-3"
                    {...bankForm.register("accountName", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    অ্যাকাউন্ট নাম্বার
                  </label>
                  <input
                    type="text"
                    placeholder="অ্যাকাউন্ট নাম্বার"
                    className="w-full border rounded-lg p-3"
                    {...bankForm.register("accountNumber", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ব্যালেন্স
                  </label>
                  <input
                    type="number"
                    placeholder="ব্যালেন্স"
                    className="w-full border rounded-lg p-3"
                    {...bankForm.register("balance", { required: true })}
                  />
                </div>

                <div className="col-span-full flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold disabled:opacity-70"
                    disabled={addNewBankMutation.isPending}
                  >
                    {addNewBankMutation.isPending ? "অপেক্ষা করুন" : "যোগ করুন"}
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
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 h-screen w-screen"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">ব্যাংক এডিট করুন</h2>
              <form
                onSubmit={editForm.handleSubmit(handleEditBank)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ব্যাংকের নাম
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    {...editForm.register("bank", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    শাখা
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    {...editForm.register("branch", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing No
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    {...editForm.register("routingNo", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    অ্যাকাউন্ট নাম
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    {...editForm.register("accountName", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    অ্যাকাউন্ট নাম্বার
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    {...editForm.register("accountNumber", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ব্যালেন্স
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg p-3"
                    {...editForm.register("balance", { required: true })}
                  />
                </div>

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

        {/*add balance modal */}
        {showBalanceModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 h-screen w-screen"
            onClick={() => setShowBalanceModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm animate-fade-in space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">ব্যালেন্স যোগ করুন</h2>

              <select
                className="w-full border rounded-lg p-3"
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(Number(e.target.value))}
              >
                {banks.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.bank} - {b.branch}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="৳ পরিমাণ (যেমন: 500 বা -200)"
                className="w-full border rounded-lg p-3"
                value={balanceValue}
                onChange={(e) => setBalanceValue(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBalanceModal(false)}
                  className="flex-1 py-2 rounded-lg border"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => handleAdjustBalance()}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold disabled:opacity-75"
                  disabled={adjustBankBalanceMutation.isPending}
                >
                  {adjustBankBalanceMutation.isPending
                    ? "অপেক্ষা করুন..."
                    : "যোগ করুন"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showTxnModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4"
            onClick={() => setShowTxnModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl animate-fade-in space-y-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                নতুন ট্রানজেকশন যোগ করুন
              </h2>
              <form
                onSubmit={txnForm.handleSubmit(handleAddTransaction)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-3"
                    {...txnForm.register("date", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    সময়
                  </label>
                  <input
                    type="time"
                    className="w-full border rounded-lg p-3"
                    {...txnForm.register("time", { required: true })}
                    defaultValue={new Date().toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ব্যাংক
                  </label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    শাখা
                  </label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    প্রেরক
                  </label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    গ্রাহক
                  </label>
                  <input
                    type="text"
                    placeholder="গ্রাহক"
                    className="w-full border rounded-lg p-3"
                    {...txnForm.register("receiverName", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    পরিমাণ
                  </label>
                  <input
                    type="number"
                    placeholder="পরিমাণ"
                    className="w-full border rounded-lg p-3"
                    {...txnForm.register("amount", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ফি
                  </label>
                  <input
                    type="number"
                    placeholder="ফি"
                    className="w-full border rounded-lg p-3"
                    {...txnForm.register("fee", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    পে
                  </label>
                  <input
                    type="number"
                    placeholder="পে"
                    className="w-full border rounded-lg p-3"
                    {...txnForm.register("pay", { required: true })}
                  />
                </div>

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

        <TableComponent
          data={transactions}
          columns={BankTxnColumns}
          pagination=""
          setPagination=""
          pageCount=""
          isFetching={false}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default BankTransactions;
