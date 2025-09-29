import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AllTransactionColumns } from "../components/columns/AllTransactionColumns";
import TableComponent from "../components/shared/Table/Table";
import { Dummytransactions } from "../data/transactions";
import { Field } from "./Field";
import { clamp2, daysAgo, todayISO, uid } from "./utils";

export default function ClientTransactions() {
  const [numbers, setNumbers] = useState([
    { id: "n1", channel: "Bkash", kind: "Agent", label: "Agent 1" },
    { id: "n2", channel: "Bkash", kind: "Personal", label: "Personal 1" },
    { id: "n3", channel: "Nagad", kind: "Agent", label: "Agent 2" },
  ]);

  const [clients, setClients] = useState([
    { id: "c1", name: "Client A" },
    { id: "c2", name: "Client B" },
  ]);

  const [transactions, setTransactions] = useState(Dummytransactions);
  // will delete
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [filter, setFilter] = useState({
    q: "",
    channel: "",
    type: "",
    dateFrom: daysAgo(30),
  });

  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: {
      date: todayISO(),
      channel: "Bkash",
      type: "Cash In",
      numberType: "Agent",
      numberId: "",
      amount: "",
      commission: "",
      clientId: "",
      note: "",
      billType: "",
      dueAmount: "",
      sendSms: false,
      total: "",
      profit: "",
    },
  });

  // 🔥 calculate profit & total inline
  const amount = parseFloat(watch("amount")) || 0;
  const commission = parseFloat(watch("commission"));
  const type = watch("type");

  // 🔥 Auto calculation with useEffect
  useEffect(() => {
    let profitCalc = watch("profit");
    let totalCalc = watch("total");

    if (!isNaN(commission)) {
      if (type === "Cash In") {
        profitCalc = (amount * commission) / 100;
      } else if (type === "Cash Out") {
        profitCalc = (amount * commission) / 1000;
      }
      setValue("profit", profitCalc);
    }

    if (amount || profitCalc) {
      totalCalc = amount + (parseFloat(profitCalc) || 0);
      setValue("total", totalCalc);
    }
  }, [amount, commission, type, setValue, watch]);

  // ✅ When channel switches, enforce Bill Payment rules
  useEffect(() => {
    const channel = watch("channel");
    const numberType = watch("numberType");

    if (channel === "Bill Payment") {
      // clear number fields
      setValue("numberType", "");
      setValue("numberId", "");
    } else if (!numberType) {
      // restore sensible default
      setValue("numberType", "Agent");
    }
  }, [watch("channel"), watch("numberType"), setValue]);

  // close modal on esc
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setNewTxOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const filtered = useMemo(() => {
    const dateTo = todayISO();
    return transactions
      .filter((t) => {
        if (filter.q) {
          const s = `${t.channel} ${t.type} ${t.numberLabel || ""} ${
            t.clientName || ""
          } ${t.amount} ${t.note || ""} ${t.billType || ""}`.toLowerCase();
          if (!s.includes(filter.q.toLowerCase())) return false;
        }
        if (filter.channel && t.channel !== filter.channel) return false;
        if (filter.type && t.type !== filter.type) return false;
        if (filter.dateFrom && t.date < filter.dateFrom) return false;
        if (t.date > dateTo) return false; // ✅ auto-clamped to today
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filter]);

  const addTx = (data) => {
    const client = clients.find((c) => c.id === data.clientId);
    const number = numbers.find((n) => n.id === data.numberId);

    const tx = {
      id: uid("tx"),
      date: data.date,
      channel: data.channel,
      type: data.type || "",
      numberType: data.numberType || "",
      numberId: number?.id || "",
      numberLabel: number?.label || "",
      billType: data.channel === "Bill Payment" ? data.billType : "",
      clientId: client?.id || "",
      clientName: client?.name || "",
      amount: clamp2(data.amount),
      commission: clamp2(data.commission || 0),
      note: data.note || "",
      dueAmount: clamp2(data.dueAmount || 0),
      profit: clamp2(data.profit || 0),
      total: clamp2(data.total || 0),
    };

    console.log("Saved transaction:", tx);
    reset(); // clear form
    setNewTxOpen(false);
  };

  const isBillPayment = watch("channel") === "Bill Payment";

  return (
    <section className="grid lg:grid-cols-5 gap-6 mt-10 relative">
      {/* All Transactions */}
      <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/90 dark:bg-gray-900/80 backdrop-blur shadow-lg rounded-tr-none rounded-tl-none">
        {/* top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              সব ট্রান্সাকশন
            </h3>

            {/* open modal button */}
            <button
              className="px-4 py-2 rounded-xl text-white font-semibold shadow-md transition
                         bg-gradient-to-r from-[#862C8A] to-[#009C91]
                         hover:opacity-95 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#862C8A]"
              onClick={() => setNewTxOpen(true)}
            >
              Add Transaction
            </button>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-5 gap-2 mb-4">
            <input
              className="md:col-span-2 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
              placeholder="সার্চ..."
              value={filter.q}
              onChange={(e) => setFilter({ ...filter, q: e.target.value })}
            />
            <select
              className="rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
              value={filter.channel}
              onChange={(e) =>
                setFilter({ ...filter, channel: e.target.value })
              }
            >
              <option value="">Channel</option>
              {["Bkash", "Nagad", "Rocket", "Bill Payment"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="">Type</option>
              {["Cash In", "Cash Out", "Bill Payment"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="flex">
              <input
                type="date"
                className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                value={filter.dateFrom}
                onChange={(e) =>
                  setFilter({ ...filter, dateFrom: e.target.value })
                }
              />
            </div>
          </div>

          {/* Table */}
          {filtered.length > 0 ? (
            <TableComponent data={filtered} columns={AllTransactionColumns} />
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              কোনো ট্রান্সাকশন পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {newTxOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            aria-hidden="true"
            onClick={() => setNewTxOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add new transaction"
            className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl border bg-white dark:bg-gray-900"
            style={{
              borderImageSlice: 1,
              borderImageSource:
                "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient top bar */}
            <div
              className="h-1 w-full rounded-t-2xl"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
            />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  নতুন ট্রান্সাকশন
                </h3>
                <button
                  onClick={() => setNewTxOpen(false)}
                  className="text-sm px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:opacity-90"
                >
                  Close
                </button>
              </div>

              {/* FORM */}
              <form className="space-y-4" onSubmit={handleSubmit(addTx)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="তারিখ">
                    <input
                      type="date"
                      {...register("date", { required: true })}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                      required
                    />
                  </Field>
                  <Field label="চ্যানেল">
                    <select
                      {...register("channel", { required: true })}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                    >
                      {["Bkash", "Nagad", "Rocket", "Bill Payment"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {isBillPayment && (
                    <Field label="বিল টাইপ">
                      <select
                        {...register("billType", { required: true })}
                        className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                        required
                      >
                        <option value="">— সিলেক্ট —</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Internet">Internet</option>
                        <option value="Gas">Gas</option>
                      </select>
                    </Field>
                  )}

                  {!isBillPayment && (
                    <Field label="টাইপ">
                      <select
                        {...register("type", { required: true })}
                        className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                      >
                        {["Cash In", "Cash Out"].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field label="অ্যামাউন্ট (৳)">
                    <input
                      type="number"
                      step="0.01"
                      {...register("amount", { required: true })}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label={`কমিশন (প্রতি হাজারে)`}>
                    <input
                      type="number"
                      step="0.01"
                      {...register("commission")}
                      className={`w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                                focus:outline-none  focus:ring-2 focus:ring-[#862C8A] focus:border-transparent`}
                    />
                  </Field>

                  <Field label="টোটাল">
                    <input
                      type="number"
                      step="0.01"
                      {...register("total", { required: true })}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                      required
                    />
                  </Field>

                  <Field label="লাভ">
                    <input
                      type="number"
                      step="0.01"
                      {...register("profit")}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                      required
                    />
                  </Field>

                  <Field label="ক্লায়েন্ট">
                    <select
                      {...register("clientId")}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                    >
                      <option value="">— সিলেক্ট —</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="বাকি (৳)">
                    <input
                      type="number"
                      step="0.01"
                      {...register("dueAmount")}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                      placeholder="বাকি টাকা"
                    />
                  </Field>

                  <Field label="নোট">
                    <input
                      {...register("note")}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                      placeholder="নোট লিখুন..."
                    />
                  </Field>
                </div>

                {/*  SMS opt-in checkbox at the bottom */}
                <div className="flex items-center gap-2">
                  <input
                    id="send-sms"
                    type="checkbox"
                    {...register("sendSms")}
                    className="h-4 w-4 rounded border-gray-300 text-[#862C8A] focus:ring-[#862C8A]"
                  />
                  <label
                    htmlFor="send-sms"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    SMS পাঠান
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:opacity-90"
                    onClick={() => setNewTxOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl text-white font-semibold shadow-md transition
                             bg-gradient-to-r from-[#862C8A] to-[#009C91]
                             hover:opacity-95 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#862C8A]"
                  >
                    সেভ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
