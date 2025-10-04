import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AllTransactionColumns } from "../components/columns/AllTransactionColumns";
import TableComponent from "../components/shared/Table/Table";
import TableLoading from "../components/shared/TableLoading/TableLoading";
import { useClientsSelect } from "../hooks/useClient";
import {
  useCreateDailyTransaction,
  useGetTransactions,
} from "../hooks/useDailyTxn";
import { useWalletNumbers } from "../hooks/useWallet";
import { Field } from "./Field";
import { clamp2, daysAgo, todayISO } from "./utils";

export default function ClientTransactions() {
  const createDailyTxnMutation = useCreateDailyTransaction();

  const [customMessage, setCustomMessage] = useState("");
  const {
    data: walletNumbers,
    isLoading: walletLoading,
    isError,
  } = useWalletNumbers();

  const {
    data: allClients,
    isLoading: clientLoading,
    isError: clientError,
  } = useClientsSelect();

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
      setTransactions(data?.data); // sync fetched data into state
    }
  }, [data]);

  // console.log("transactions", transactions);
  // console.log("data", data);

  // will delete
  const [newTxOpen, setNewTxOpen] = useState(false);

  const [filter, setFilter] = useState({
    q: "",
    channel: "",
    type: "",
    dateFrom: daysAgo(30),
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      date: todayISO(),
      channel: "",
      type: "Cash In",
      numberType: "Agent",
      amount: "",
      commission: "",
      clientId: "",
      note: "",
      billType: "",
      due: "",
      isSendMessage: false,
      total: "",
      profit: "",
    },
  });

  const amount = parseFloat(watch("amount")) || 0;
  const commission = parseFloat(watch("commission"));
  const billType = watch("billType");
  const type = watch("type");
  const channel = watch("channel");
  const isSendMessage = watch("isSendMessage");

  const total = watch("total");

  useEffect(() => {
    if (total !== "" && !isNaN(total)) {
      setValue("total", parseFloat(total).toFixed(2));
    }
  }, [total, setValue]);

  const profit = watch("profit");

  useEffect(() => {
    if (profit !== "" && !isNaN(profit)) {
      setValue("profit", parseFloat(profit).toFixed(2));
    }
  }, [profit, setValue]);

  // calculate profit & total inline
  useEffect(() => {
    if (!isSendMessage) {
      setCustomMessage("");
      return;
    }

    if (type === "Cash Out") {
      setCustomMessage(`${amount} টাকা ক্যাশ-আউট করা হয়েছে`);
    } else if (type === "Cash In") {
      setCustomMessage(`${amount} টাকা ক্যাশ-ইন করা হয়েছে`);
    } else if (channel === "Bill Payment") {
      setCustomMessage(`${amount} টাকা ${billType} বিল পে করা হয়েছে`);
    }
  }, [isSendMessage, type, channel, amount, billType]);

  useEffect(() => {
    if (channel === "Bill Payment") {
      setValue("type", "");
    } else {
      setValue("billType", "");
    }
  }, [channel, setValue]);

  // set commission default only when type changes
  useEffect(() => {
    if (type === "Cash Out") {
      setValue("commission", 3.75, { shouldValidate: true });
    } else if (type === "Cash In") {
      setValue("commission", 1.5, { shouldValidate: true });
    }
  }, [type, setValue]);

  // Auto calculation with useEffect
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
          const s = `${t.channel} ${t.type} ${t.client_name || ""} ${
            t.amount
          } ${t.note || ""} ${t.bill_type || ""}`.toLowerCase();
          if (!s.includes(filter.q.toLowerCase())) return false;
        }
        if (filter.channel && t.channel !== filter.channel) return false;
        if (filter.type && t.type !== filter.type) return false;
        if (filter.dateFrom && t.date < filter.dateFrom) return false;
        if (t.date > dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        if (!a.date) return 1; // push invalid dates to bottom
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });
  }, [transactions, filter]);

  console.log("filtered", filtered);

  const addTx = (data) => {
    const client = allClients.find((c) => c._id === data.clientId);
    const wallet = walletNumbers.find((w) => w._id === data.channel);
    // console.log("data", data.clientId);
    // console.log("wallet", data.channel);

    // Create optimistic transaction
    const optimisticTx = {
      _id: Date.now().toString(), // temporary ID
      date: data.date,
      channel: wallet?.channel || "",
      wallet_id: wallet?._id || "",
      type: data.type || "",
      bill_type: data.channel === "Bill Payment" ? data.billType : "",
      client_id: client?._id || "",
      client_name: client?.name || "",
      amount: clamp2(data.amount),
      fee: clamp2(data.commission || 0),
      note: data.note || "",
      due: clamp2(data.due || 0),
      profit: clamp2(data.profit || 0),
      total: clamp2(data.total || 0),
      isSendMessage: data.isSendMessage,
      message: customMessage,
      optimistic: true,
    };

    // Keep previous for rollback
    const prevTx = [...transactions];

    // Optimistic UI
    setTransactions((prev) => [optimisticTx, ...prev]);

    // Call backend
    createDailyTxnMutation.mutate(optimisticTx, {
      onSuccess: (savedTx) => {
        console.log("savedTx", savedTx);
        // Replace optimistic with server tx
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === optimisticTx._id ? savedTx : tx))
        );
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
        reset(); // clear form
        setNewTxOpen(false);
      },
    });
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
              {walletNumbers.map((c) => (
                <option key={c._id} value={c.channel}>
                  {c.channel}
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
          {isLoading ? (
            <TableLoading />
          ) : filtered.length > 0 ? (
            <TableComponent
              data={filtered}
              columns={AllTransactionColumns}
              pagination={pagination}
              setPagination={setPagination}
              pageCount={data?.pagination?.totalPages ?? -1}
              isFetching={isFetching}
              isLoading={isLoading}
            />
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
            className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl border bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto"
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
                  <Field label="ওয়ালেট">
                    <select
                      {...register("channel", { required: true })}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                    >
                      {walletNumbers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.channel}
                        </option>
                      ))}
                      <option value="Bill Payment">Bill Payment</option>
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
                        <option value=""> — সিলেক্ট —</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Internet">Internet</option>
                        <option value="Gas">Gas</option>
                        <option value="others">Others</option>
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
                  <Field
                    label={
                      type === "Cash In" ? "কমিশন (%)" : "কমিশন (প্রতি হাজারে)"
                    }
                  >
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
                      step="any"
                      {...register("total", { required: true })}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                      required
                    />
                  </Field>

                  <Field label="লাভ">
                    <input
                      type="number"
                      step="any"
                      {...register("profit")}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                      required
                    />
                  </Field>

                  <Field label="ক্লায়েন্ট">
                    <select
                      {...register("clientId")}
                      className="w-full overflow-y-auto rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                    >
                      {clientLoading && <option value="">Loading...</option>}
                      <option value="">— সিলেক্ট —</option>
                      {allClients.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="বাকি (৳)">
                    <input
                      type="number"
                      step="0.01"
                      {...register("due")}
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

                <div className="flex items-center gap-2">
                  <input
                    className="w-4 h-4 cursor-pointer accent-[#009C91]"
                    id="message"
                    type="checkbox"
                    {...register("isSendMessage")}
                  />

                  <label
                    htmlFor="message"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    SMS পাঠান
                  </label>
                </div>

                {isSendMessage && (
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Message
                    </label>

                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>
                )}

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
                    {createDailyTxnMutation.isPending
                      ? "সেভ হচ্ছে..."
                      : "সেভ করুন"}
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
