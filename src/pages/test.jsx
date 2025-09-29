import { useEffect, useMemo, useState } from "react";
import { AllTransactionColumns } from "../components/columns/AllTransactionColumns";
import TableComponent from "../components/shared/Table/Table";
import { Dummytransactions } from "../data/transactions";
import { Field } from "./Field";
import { clamp2, daysAgo, todayISO, uid } from "./utils";

export default function Transactionscopy({ ctx }) {
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
  console.log(transactions);

  const { state, dispatch } = ctx; // will delete
  const [newTxOpen, setNewTxOpen] = useState(true);
  const [filter, setFilter] = useState({
    q: "",
    channel: "",
    type: "",
    dateFrom: daysAgo(30),
  });

  const [form, setForm] = useState({
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
    profit: "",
    total: "",
  });

  // 🔥 calculate profit & total inline
  const amountNum = parseFloat(form.amount) || 0;
  const commissionNum = parseFloat(form.commission);
  let profitCalc = form.profit;
  let totalCalc = form.total;

  if (!isNaN(commissionNum)) {
    if (form.type === "Cash In") {
      // Commission as percentage
      profitCalc = (amountNum * commissionNum) / 100;
    } else if (form.type === "Cash Out") {
      // Commission per thousand
      profitCalc = (amountNum * commissionNum) / 1000;
    }
  }

  if (amountNum || profitCalc) {
    totalCalc = amountNum + (parseFloat(profitCalc) || 0);
  }

  // ✅ When channel switches, enforce Bill Payment rules
  useEffect(() => {
    if (form.channel === "Bill Payment") {
      setForm((f) => ({
        ...f,
        numberType: "",
        numberId: "",
      }));
    } else if (!form.numberType) {
      setForm((f) => ({ ...f, numberType: "Agent" }));
    }
  }, [form.channel, form.numberType]);

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
        if (t.date > dateTo) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filter]);

  function addTx(e) {
    e.preventDefault();
    const client = clients.find((c) => c.id === form.clientId);
    const number = numbers.find((n) => n.id === form.numberId);

    const tx = {
      id: uid("tx"),
      date: form.date,
      channel: form.channel,
      type: form.type || "",
      numberType: form.numberType || "",
      numberId: number?.id || "",
      numberLabel: number?.label || "",
      billType: form.channel === "Bill Payment" ? form.billType : "",
      clientId: client?.id || "",
      clientName: client?.name || "",
      amount: clamp2(form.amount),
      commission: clamp2(form.commission || 0),
      note: form.note || "",
      dueAmount: clamp2(form.dueAmount || 0),
      profit: clamp2(profitCalc || 0),
      total: clamp2(totalCalc || 0),
    };

    console.log("Saved transaction:", tx);

    setForm((f) => ({
      ...f,
      amount: "",
      commission: "",
      note: "",
      dueAmount: "",
      profit: "",
      total: "",
    }));

    setNewTxOpen(false);
  }

  const isBillPayment = form.channel === "Bill Payment";

  return (
    <section className="grid lg:grid-cols-5 gap-6 mt-10 relative">
      {/* Transactions Table */}
      <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/90 dark:bg-gray-900/80 backdrop-blur shadow-lg rounded-tr-none rounded-tl-none">
        <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              সব ট্রান্সাকশন
            </h3>
            <button
              className="px-4 py-2 rounded-xl text-white font-semibold shadow-md transition
                         bg-gradient-to-r from-[#862C8A] to-[#009C91]"
              onClick={() => setNewTxOpen(true)}
            >
              Add Transaction
            </button>
          </div>

          <TableComponent data={filtered} columns={AllTransactionColumns} />
        </div>
      </div>

      {/* Add Transaction Modal */}
      {newTxOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setNewTxOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
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
            <div
              className="h-1 w-full rounded-t-2xl"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
            />
            <div className="p-5">
              <form className="space-y-4" onSubmit={addTx}>
                {/* Date + Channel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="তারিখ">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field label="চ্যানেল">
                    <select
                      value={form.channel}
                      onChange={(e) =>
                        setForm({ ...form, channel: e.target.value })
                      }
                    >
                      {["Bkash", "Nagad", "Rocket", "Bill Payment"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Type / BillType + Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {isBillPayment ? (
                    <Field label="বিল টাইপ">
                      <select
                        value={form.billType}
                        onChange={(e) =>
                          setForm({ ...form, billType: e.target.value })
                        }
                      >
                        <option value="">— সিলেক্ট —</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Internet">Internet</option>
                        <option value="Gas">Gas</option>
                      </select>
                    </Field>
                  ) : (
                    <Field label="টাইপ">
                      <select
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
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
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      required
                    />
                  </Field>
                </div>

                {/* Commission + Profit + Total */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="কমিশন (প্রতি হাজারে)">
                    <input
                      type="number"
                      step="0.01"
                      value={form.commission}
                      onChange={(e) =>
                        setForm({ ...form, commission: e.target.value })
                      }
                      placeholder="Commission per 1000"
                    />
                  </Field>

                  <Field label="লাভ">
                    <input
                      type="number"
                      step="0.01"
                      value={profitCalc}
                      onChange={(e) =>
                        setForm({ ...form, profit: e.target.value })
                      }
                      placeholder="লাভ লিখুন"
                    />
                  </Field>

                  <Field label="টোটাল">
                    <input
                      type="number"
                      step="0.01"
                      value={totalCalc}
                      onChange={(e) =>
                        setForm({ ...form, total: e.target.value })
                      }
                    />
                  </Field>
                </div>

                {/* Client + Due + Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="ক্লায়েন্ট">
                    <select
                      value={form.clientId}
                      onChange={(e) =>
                        setForm({ ...form, clientId: e.target.value })
                      }
                    >
                      <option value="">— অপশনাল —</option>
                      {state.clients.map((c) => (
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
                      value={form.dueAmount}
                      onChange={(e) =>
                        setForm({ ...form, dueAmount: e.target.value })
                      }
                      placeholder="বাকি টাকা"
                    />
                  </Field>

                  <Field label="নোট">
                    <input
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      placeholder="নোট লিখুন..."
                    />
                  </Field>
                </div>

                {/* SMS Opt-in */}
                <div className="flex items-center gap-2">
                  <input
                    id="send-sms"
                    type="checkbox"
                    checked={form.sendSms}
                    onChange={(e) =>
                      setForm({ ...form, sendSms: e.target.checked })
                    }
                  />
                  <label htmlFor="send-sms">SMS পাঠান</label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTxOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-[#862C8A] to-[#009C91]">
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
