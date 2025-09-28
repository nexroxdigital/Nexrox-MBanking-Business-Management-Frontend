import { useState } from "react";
import { useForm } from "react-hook-form";
import TransactionTable from "../components/Transactions/TransactionTable";
import { todayISO } from "./utils";

/* ---------- helpers ---------- */
const computeAgent = ({ taka, commissionPct }) => {
  const commissionAmt = (Number(taka || 0) / 1000) * Number(commissionPct || 0);
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

const channelOptions = {
  agent: ["Bkash Agent", "Nagad Agent", "Rocket Agent"],
  personal: ["Bkash Personal", "Nagad Personal", "Rocket Personal"],
};

const itemOptions = ["photocopy", "picture", "printing", "other"];

/* ---------- Main ---------- */
const DailyTransactions = () => {
  const [transactions, setTransactions] = useState([
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
     {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
     {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
     {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
     {
      date: "2025-09-28",
      item: "ক্যাশ আউট (এজেন্ট)",
      method: "Bkash Agent",
      pay: 1050,
      fee: 50,
      commission: 0,
      cost: 0,
      refund: 0,
      profit: 50,
    },
    {
      date: "2025-09-28",
      item: "ক্যাশ ইন (পার্সোনাল)",
      method: "Nagad Personal",
      pay: 1020,
      fee: 20,
      cost: 20,
      refund: 0,
      profit: 20,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("agent");
  const [cashItems, setCashItems] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);

  // RHF forms
  const {
    register: registerAgent,
    handleSubmit: handleAgentSubmit,
    reset: resetAgent,
    watch: watchAgent,
  } = useForm({
    defaultValues: {
      date: todayISO(),
      channel: "",
      taka: "",
      commissionPct: "",
      paid: "",
      commission: 0,
    },
  });

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
      feePct: "",
      paid: "",
      refund: "",
    },
  });

  const {
    register: registerCash,
    handleSubmit: handleCashSubmit,
    reset: resetCash,
    getValues: getCashValues,
  } = useForm({
    defaultValues: {
      taka: "",
      paid: "",
      profit: "",
      itemInput: "",
    },
  });

  /* ---------- Save Handlers ---------- */
  const saveAgent = (data) => {
    const { commissionAmt, total, profit } = computeAgent(data);
    setTransactions((s) => [
      ...s,
      {
        date: data.date,
        item: "ক্যাশ আউট (এজেন্ট)",
        method: data.channel,
        pay: total,
        fee: 0,
        commission: commissionAmt,
        cost: 0,
        refund: 0,
        profit,
      },
    ]);

    resetAgent({
      date: todayISO(),
      channel: "",
      taka: "",
      commissionPct: "",
      paid: "",
      commission: 0,
    });
    resetPersonal({
      date: todayISO(),
      channel: "",
      taka: "",
      feePct: "",
      paid: "",
      refund: "",
    });
    resetCash({ taka: "", paid: "", profit: "", itemInput: "" });
    setCashItems([]);
    setShowModal(false);
  };

  const savePersonal = (data) => {
    const { feeAmt, total, expense, profit } = computePersonal(data);
    setTransactions((s) => [
      ...s,
      {
        date: data.date,
        item: "ক্যাশ ইন (পার্সোনাল)",
        method: data.channel,
        pay: total,
        fee: feeAmt,
        cost: expense,
        refund: data.refund,
        profit,
      },
    ]);
    resetAgent({
      date: todayISO(),
      channel: "",
      taka: "",
      commissionPct: "",
      paid: "",
    });
    resetPersonal({
      date: todayISO(),
      channel: "",
      taka: "",
      feePct: "",
      paid: "",
      refund: "",
    });
    resetCash({ taka: "", paid: "", profit: "", itemInput: "" });
    setCashItems([]);
    setShowModal(false);
  };

  const saveCash = (data) => {
    setTransactions((s) => [
      ...s,
      {
        date: todayISO(),
        item: cashItems.join(", ") || "ক্যাশ",
        method: "Cash",
        pay: data.taka,
        fee: 0,
        cost: 0,
        refund: 0,
        profit: data.profit,
      },
    ]);
    resetAgent({
      date: todayISO(),
      channel: "",
      taka: "",
      commissionPct: "",
      paid: "",
    });
    resetPersonal({
      date: todayISO(),
      channel: "",
      taka: "",
      feePct: "",
      paid: "",
      refund: "",
    });
    resetCash({ taka: "", paid: "", profit: "", itemInput: "" });
    setCashItems([]);
    setShowModal(false);
  };

  /* ---------- Cash Items ---------- */
  const addCashItem = (val, itemInput) => {
    if (val === "other") {
      if (!itemInput?.trim()) return;
      const newItem = itemInput.trim();
      if (!cashItems.includes(newItem)) {
        setCashItems((s) => [...s, newItem]);
      }
      resetCash({ ...getCashValues(), itemInput: "" });
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
  const { total: agentTotal, profit: agentProfit } = computeAgent(agentVals);
  const {
    total: personalTotal,
    expense: personalExpense,
    profit: personalProfit,
  } = computePersonal(personalVals);

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
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
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
                      {channelOptions.agent.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
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
                    <span className="text-sm text-gray-600">পরিশোধ</span>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      {...registerAgent("paid")}
                    />
                  </label>
                  <div className="col-span-full flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white"
                    >
                      সংরক্ষণ করুন
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
                      {channelOptions.personal.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
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
                  <div className="col-span-full flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white"
                    >
                      সংরক্ষণ করুন
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
                              addCashItem("other", getCashValues("itemInput"));
                              setShowOtherInput(false); // hide after adding
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
                    <span className="text-sm text-gray-600">টাকা</span>
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
                      {...registerCash("paid")}
                    />
                  </label>

                  <label>
                    <span className="text-sm text-gray-600">লাভ</span>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded p-2"
                      {...registerCash("profit")}
                    />
                  </label>

                  <div className="col-span-full flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-md bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white"
                    >
                      সংরক্ষণ করুন
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

        {/* Table */}
        {/* <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm md:text-base border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {[
                  "তারিখ",
                  "আইটেম",
                  "মেথড",
                  "টাকা",
                  "ফি",
                  "খরচ",
                  "রিফান্ড",
                  "লাভ",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-3 text-left font-semibold border border-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, i) => (
                <tr
                  key={i}
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
        </div> */}

        <TransactionTable data={transactions} />
      </div>
    </div>
  );
};

export default DailyTransactions;
