import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import TableComponent from "../components/shared/Table/Table";
import TableLoading from "../components/shared/TableLoading/TableLoading";
import { transactionColumn } from "../components/Transactions/TransactionColumn";
import {
  useCreateDailyTransaction,
  useDeleteDailyTxn,
  useGetTransactions,
} from "../hooks/useDailyTxn";
import { useToast } from "../hooks/useToast";
import { useWalletNumbers } from "../hooks/useWallet";
import { clamp2, todayISO } from "./utils";

/* ---------- helpers ---------- */
const computeAgent = ({ taka, commissionPct, type }) => {
  // For Cash In: percentage (divide by 100)
  // For Cash Out: per thousand (divide by 1000)
  const commissionAmt =
    type === "Cash In"
      ? (Number(taka || 0) * Number(commissionPct || 0)) / 100
      : (Number(taka || 0) * Number(commissionPct || 0)) / 1000;

  const total = Number(taka || 0) + commissionAmt;
  const profit = commissionAmt; // profit = commission
  return { commissionAmt, total, profit };
};

const computePersonal = ({ taka, feePct }) => {
  const feeAmt = (Number(taka || 0) * Number(feePct || 0)) / 100;
  const total = Number(taka || 0) + feeAmt;
  const expense = feeAmt;
  const profit = expense;
  return { feeAmt, total, expense, profit };
};

const itemOptions = ["photocopy", "picture", "printing", "other"];

/* ---------- Main ---------- */
const DailyTransactions = () => {
  const {
    data: walletNumbers,
    isLoading: walletLoading,
    isError,
  } = useWalletNumbers();

  // Filter wallets by type
  const agentWallets =
    walletNumbers?.filter((w) => w.type.toLowerCase() === "agent") || [];
  const personalWallets =
    walletNumbers?.filter((w) => w.type.toLowerCase() === "personal") || [];

  const createDailyTxnMutation = useCreateDailyTransaction();

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching } = useGetTransactions(
    pagination.pageIndex,
    pagination.pageSize
  );

  useEffect(() => {
    if (data?.data) {
      setTransactions(data?.data);
    }
  }, [data]);

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("agent");
  const [cashItems, setCashItems] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);

  const deleteMutation = useDeleteDailyTxn();
  const { showSuccess, showError } = useToast();

  // RHF forms
  const {
    register: registerAgent,
    handleSubmit: handleAgentSubmit,
    reset: resetAgent,
    watch: watchAgent,
    setValue: setAgentValue,
  } = useForm({
    defaultValues: {
      date: todayISO(),
      channel: "",
      taka: "",
      commissionPct: "3.75",
      commission: 0,
      txn_id: "",
      type: "Cash Out",
    },
  });

  const agentType = watchAgent("type");

  useEffect(() => {
    if (agentType.toLowerCase() === "cash in") {
      setAgentValue("commissionPct", "1.5");
    } else if (agentType.toLowerCase() === "cash out") {
      setAgentValue("commissionPct", "3.75");
    }
  }, [agentType, setAgentValue]);

  const {
    register: registerPersonal,
    handleSubmit: handlePersonalSubmit,
    reset: resetPersonal,
    watch: watchPersonal,
  } = useForm({
    defaultValues: {
      date: todayISO(),
      channel: "",
      taka: "",
      feePct: "1.5",
      paid: "",
      refund: "",
      txn_id: "",
      type: "Send Money",
    },
  });

  const {
    register: registerCash,
    handleSubmit: handleCashSubmit,
    reset: resetCash,
    watch: watchCash,
  } = useForm({
    defaultValues: {
      date: todayISO(),
      taka: "",
      paid: "",
      profit: "",
      itemInput: "",
    },
  });

  // Reset forms when tab changes
  useEffect(() => {
    if (activeTab === "agent") {
      resetPersonal();
      resetCash();
      setCashItems([]);
    } else if (activeTab === "personal") {
      resetAgent();
      resetCash();
      setCashItems([]);
    } else if (activeTab === "cash") {
      resetAgent();
      resetPersonal();
    }
  }, [activeTab, resetAgent, resetPersonal, resetCash]);

  /* ---------- Save Handlers ---------- */
  const saveAgent = (data) => {
    const { total, profit } = computeAgent({
      ...data,
      type: data.type,
    });

    const wallet = walletNumbers.find((w) => w._id === data.channel);

    // Create optimistic transaction
    const optimisticTx = {
      _id: Date.now().toString(),
      date: data.date,
      channel: wallet?.channel || "",
      wallet_id: wallet?._id || "",
      type: data.type,
      amount: clamp2(data.taka),
      fee: clamp2(data.commissionPct || 0),
      profit: clamp2(profit || 0),
      total: clamp2(total || 0),
      txn_id: data.txn_id,
      optimistic: true,
    };

    const prevTx = [...transactions];

    // Optimistic UI
    setTransactions((prev) => [optimisticTx, ...prev]);

    // Call backend
    createDailyTxnMutation.mutate(optimisticTx, {
      onSuccess: (savedTx) => {
        // console.log("savedTx", savedTx);
        // Replace optimistic with server tx
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === optimisticTx._id ? savedTx : tx))
        );

        Swal.fire({
          icon: "success",
          title: "লেনদেন সফল",
          text: "ট্রানজেকশন তৈরি করা হয়েছে",
        });
      },
      onError: (err) => {
        console.error("Create txn error:", err.response?.data || err.message);

        // Rollback
        setTransactions(prevTx);

        Swal.fire({
          icon: "error",
          title: "লেনদেন ব্যর্থ",
          text:
            err.response?.data?.message || "ট্রানজেকশন তৈরি করতে সমস্যা হয়েছে",
        });
      },
      onSettled: () => {
        resetAgent();
        resetPersonal();
        resetCash();
        setCashItems([]);
        setShowModal(false);
      },
    });
  };

  const savePersonal = (data) => {
    const { feeAmt, total, expense, profit } = computePersonal(data);

    const wallet = walletNumbers.find((w) => w._id === data.channel);

    // Create optimistic transaction
    const optimisticTx = {
      _id: Date.now().toString(),
      date: data.date,
      channel: wallet?.channel || "",
      wallet_id: wallet?._id || "",
      type: data.type,
      amount: clamp2(data.taka),
      number: data.number,
      fee: clamp2(data.feePct || 0),
      profit: clamp2(profit || 0),
      total: clamp2(total || 0),
      txn_id: data.txn_id,
      optimistic: true,
    };

    const prevTx = [...transactions];

    // Optimistic UI
    setTransactions((prev) => [optimisticTx, ...prev]);

    // Call backend
    createDailyTxnMutation.mutate(optimisticTx, {
      onSuccess: (savedTx) => {
        // console.log("savedTx", savedTx);
        // Replace optimistic with server tx
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === optimisticTx._id ? savedTx : tx))
        );

        Swal.fire({
          icon: "success",
          title: "লেনদেন সফল",
          text: "ট্রানজেকশন তৈরি করা হয়েছে",
        });
      },
      onError: (err) => {
        console.error("Create txn error:", err.response?.data || err.message);

        // Rollback
        setTransactions(prevTx);

        Swal.fire({
          icon: "error",
          title: "লেনদেন ব্যর্থ",
          text:
            err.response?.data?.message || "ট্রানজেকশন তৈরি করতে সমস্যা হয়েছে",
        });
      },
      onSettled: () => {
        resetAgent();
        resetPersonal();
        resetCash();
        setCashItems([]);
        setShowModal(false);
      },
    });
  };

  const saveCash = (data) => {
    // console.log("saveCash", data.taka);

    // Calculate profit = paid - taka
    const calculatedProfit = Math.max(
      0,
      Number(data.paid || 0) - Number(data.taka || 0)
    );
    // Create optimistic transaction
    const optimisticTx = {
      _id: Date.now().toString(),
      date: data.date,
      channel: "",
      wallet_id: null,
      type: cashItems.join(", ") || "cash sale",
      amount: clamp2(data.paid),
      profit: clamp2(calculatedProfit),
      note: `${data.paid} টাকার আইটেম বিক্রি করা হয়েছে`,
      optimistic: true,
    };

    const prevTx = [...transactions];

    // Optimistic UI
    setTransactions((prev) => [optimisticTx, ...prev]);

    // Call backend
    createDailyTxnMutation.mutate(optimisticTx, {
      onSuccess: (savedTx) => {
        // console.log("savedTx", savedTx);
        // Replace optimistic with server tx
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === optimisticTx._id ? savedTx : tx))
        );

        Swal.fire({
          icon: "success",
          title: "লেনদেন সফল",
          text: "ট্রানজেকশন তৈরি করা হয়েছে",
        });
      },
      onError: (err) => {
        console.error("Create txn error:", err.response?.data || err.message);

        // Rollback
        setTransactions(prevTx);

        Swal.fire({
          icon: "error",
          title: "লেনদেন ব্যর্থ",
          text:
            err.response?.data?.message || "ট্রানজেকশন তৈরি করতে সমস্যা হয়েছে",
        });
      },
      onSettled: () => {
        resetAgent();
        resetPersonal();
        resetCash();
        setCashItems([]);
        setShowModal(false);
      },
    });
  };

  /* ---------- Cash Items ---------- */
  const addCashItem = (val, itemInput) => {
    if (val === "other") {
      if (!itemInput?.trim()) return;
      const newItem = itemInput.trim();
      if (!cashItems.includes(newItem)) {
        setCashItems((s) => [...s, newItem]);
      }
      resetCash({ ...watchCash(), itemInput: "" });
      return;
    }
    if (!val) return;
    if (!cashItems.includes(val)) {
      setCashItems((s) => [...s, val]);
    }
  };

  const removeCashItem = (name) =>
    setCashItems((s) => s.filter((x) => x !== name));

  /* ---------- Watched values ---------- */
  const agentVals = watchAgent();
  const personalVals = watchPersonal();
  const { total: agentTotal, profit: agentProfit } = computeAgent({
    ...agentVals,
    type: agentVals.type,
  });
  const {
    total: personalTotal,
    expense: personalExpense,
    profit: personalProfit,
  } = computePersonal(personalVals);

  // Delete handler
  const handleDeleteTxn = (id) => {
    const prev = [...transactions];

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই লেনদেনটি ডিলিট হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        // Optimistic UI update
        setTransactions((prev) => prev.filter((txn) => txn._id !== id));

        // Call backend
        deleteMutation.mutate(id, {
          onError: () => {
            //  Rollback if error
            setTransactions(prev);
            Swal.fire("ত্রুটি", "লেনদেন ডিলিট ব্যর্থ হয়েছে", "error");
          },
          onSuccess: () => {
            showSuccess("লেনদেন সফলভাবে ডিলিট হয়েছে।");
          },
        });
      }
    });
  };

  return (
    <div className="mt-10">
      <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
      <div className="bg-white shadow-lg rounded-xl p-6 rounded-tr-none rounded-tl-none">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg md:text-3xl font-bold text-gray-800">
            দৈনিক লেনদেন
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white shadow-md"
          >
            + নতুন লেনদেন
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {["agent", "personal", "cash"].map((id) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`px-4 py-2 rounded-md border ${
                      activeTab === id
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {id === "agent"
                      ? "এজেন্ট"
                      : id === "personal"
                      ? "পার্সোনাল"
                      : "ক্যাশ"}
                  </button>
                ))}
              </div>

              {/* Agent Form */}
              {activeTab === "agent" && (
                <form
                  onSubmit={handleAgentSubmit(saveAgent)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label>
                    <span className="text-sm text-gray-600">তারিখ</span>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      {...registerAgent("date", { required: true })}
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">চ্যানেল</span>
                    <select
                      className="w-full border rounded p-2"
                      {...registerAgent("channel", { required: true })}
                    >
                      <option value="">চ্যানেল নির্বাচন</option>
                      {agentWallets.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">টাইপ</span>
                    <select
                      className="w-full border rounded p-2"
                      {...registerAgent("type", { required: true })}
                    >
                      <option value="Cash Out">Cash Out</option>
                      <option value="Cash In">Cash In</option>
                    </select>
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">টাকা</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2"
                      {...registerAgent("taka", { required: true })}
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">
                      কমিশন (প্রতি 1000)
                    </span>
                    <input
                      type="number"
                      step="any"
                      defaultValue="4.25"
                      className="w-full border rounded p-2"
                      {...registerAgent("commissionPct", { required: true })}
                    />
                  </label>
                  {/* Computed */}
                  <label>
                    <span className="text-sm text-gray-600">মোট (অটো)</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2 bg-gray-50"
                      value={agentTotal || ""}
                      readOnly
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">লাভ (অটো)</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2 bg-gray-50"
                      value={agentProfit || ""}
                      readOnly
                    />
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">Txn ID</span>
                    <input
                      type="text"
                      className="w-full border rounded p-2 bg-gray-50"
                      {...registerAgent("txn_id")}
                    />
                  </label>

                  <div className="col-span-full flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white"
                    >
                      {createDailyTxnMutation.isPending
                        ? "অপেক্ষা করুন..."
                        : "সংরক্ষণ করুন "}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2 rounded-md border"
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              )}

              {/* Personal Form */}
              {activeTab === "personal" && (
                <form
                  onSubmit={handlePersonalSubmit(savePersonal)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <label>
                    <span className="text-sm text-gray-600">তারিখ</span>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      {...registerPersonal("date", { required: true })}
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">চ্যানেল</span>
                    <select
                      className="w-full border rounded p-2"
                      {...registerPersonal("channel", { required: true })}
                    >
                      <option value="">চ্যানেল নির্বাচন</option>
                      {personalWallets.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">টাইপ</span>
                    <select
                      className="w-full border rounded p-2"
                      {...registerPersonal("type", { required: true })}
                    >
                      <option value="Send Money">Send Money</option>
                      <option value="Receive Money">Receive Money</option>
                    </select>
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">নম্বর</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2"
                      {...registerPersonal("number")}
                    />
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">টাকা</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2"
                      {...registerPersonal("taka", { required: true })}
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">ফি (%)</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2"
                      defaultValue="1.5"
                      {...registerPersonal("feePct", { required: true })}
                    />
                  </label>
                  {/* Computed */}
                  <label>
                    <span className="text-sm text-gray-600">খরচ (অটো)</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2 bg-gray-50"
                      value={personalExpense || ""}
                      readOnly
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">মোট (অটো)</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2 bg-gray-50"
                      value={personalTotal || ""}
                      readOnly
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">লাভ (অটো)</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2 bg-gray-50"
                      value={personalProfit || ""}
                      readOnly
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">পরিশোধ</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      {...registerPersonal("paid")}
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">রিফান্ড</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      {...registerPersonal("refund")}
                    />
                  </label>
                  <label>
                    <span className="text-sm text-gray-600">Txn ID</span>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      {...registerPersonal("txn_id")}
                    />
                  </label>
                  <div className="col-span-full flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white"
                    >
                      {createDailyTxnMutation.isPending
                        ? "অপেক্ষা করুন..."
                        : "সংরক্ষণ করুন "}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2 rounded-md border"
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              )}

              {/* Cash Form */}
              {activeTab === "cash" && (
                <form
                  onSubmit={handleCashSubmit(saveCash)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">
                      আইটেম
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="w-full border rounded p-2"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "other") {
                            setShowOtherInput(true); // show input
                          } else {
                            setShowOtherInput(false); // hide input
                            addCashItem(val, "");
                          }
                        }}
                      >
                        <option value="">একটি আইটেম বাছাই করুন</option>
                        {itemOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {/* Input + Done icon for custom "other" */}
                      {showOtherInput && (
                        <>
                          <input
                            type="text"
                            placeholder="নতুন আইটেম"
                            className="flex-1 border rounded p-2"
                            {...registerCash("itemInput")}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              addCashItem("other", watchCash("itemInput"));
                              setShowOtherInput(false);
                            }}
                            className="px-3 rounded-md border bg-gray-50"
                          >
                            ✓
                          </button>
                        </>
                      )}
                    </div>

                    {cashItems.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {cashItems.map((it) => (
                          <span
                            key={it}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm bg-gray-50"
                          >
                            {it}
                            <button
                              type="button"
                              onClick={() => removeCashItem(it)}
                              className="text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <label>
                    <span className="text-sm text-gray-600">তারিখ</span>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      {...registerCash("date", { required: true })}
                    />
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">দাম</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2"
                      {...registerCash("taka", { required: true })}
                    />
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">পরিশোধ</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2"
                      {...registerCash("paid", { required: true })}
                    />
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">লাভ (অটো)</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2 bg-gray-50"
                      value={Math.max(
                        0,
                        Number(watchCash("paid") || 0) -
                          Number(watchCash("taka") || 0)
                      )}
                      readOnly
                    />
                  </label>

                  <div className="col-span-full flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white"
                    >
                      {createDailyTxnMutation.isPending
                        ? "অপেক্ষা করুন..."
                        : "সংরক্ষণ করুন "}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2 rounded-md border"
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* <TransactionTable data={transactions} /> */}

        {isLoading ? (
          <TableLoading />
        ) : transactions.length < 1 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            কোনো ট্রান্সাকশন পাওয়া যায়নি
          </div>
        ) : (
          <TableComponent
            data={transactions}
            columns={transactionColumn(handleDeleteTxn)}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={data?.pagination?.totalPages ?? -1}
            isFetching={isFetching}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DailyTransactions;
