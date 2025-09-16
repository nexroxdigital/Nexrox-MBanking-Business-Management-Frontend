import { useEffect, useMemo, useState } from "react";
import { Field } from "./Field";
import {
  clamp2,
  COMMISSION_RATES,
  daysAgo,
  fmtBDT,
  todayISO,
  uid,
} from "./utils";

export default function Transactions({ ctx }) {
  const { state, dispatch } = ctx;
  const [filter, setFilter] = useState({
    q: "",
    channel: "",
    type: "",
    dateFrom: daysAgo(30),
    dateTo: todayISO(),
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
    number: "",
  });

  // number choices filtered by channel & numberType
  const numberChoices = useMemo(
    () =>
      state.numbers.filter(
        (n) =>
          (!form.channel || n.channel === form.channel) &&
          (form.numberType ? n.kind === form.numberType : true)
      ),
    [state.numbers, form.channel, form.numberType]
  );

  // auto-commission for Agent
  useEffect(() => {
    if (
      form.numberType === "Agent" &&
      form.amount &&
      form.channel &&
      form.type
    ) {
      const rate = COMMISSION_RATES[form.channel]?.[form.type] || 0;
      setForm((f) => ({ ...f, commission: clamp2(Number(f.amount) * rate) }));
    }
  }, [form.amount, form.channel, form.type, form.numberType]);

  const filtered = useMemo(() => {
    return state.transactions
      .filter((t) => {
        if (filter.q) {
          const s =
            `${t.channel} ${t.type} ${t.numberLabel} ${t.clientName} ${t.amount} ${t.note}`.toLowerCase();
          if (!s.includes(filter.q.toLowerCase())) return false;
        }
        if (filter.channel && t.channel !== filter.channel) return false;
        if (filter.type && t.type !== filter.type) return false;
        if (filter.dateFrom && t.date < filter.dateFrom) return false;
        if (filter.dateTo && t.date > filter.dateTo) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [state.transactions, filter]);

  function addTx(e) {
    e.preventDefault();
    const client = state.clients.find((c) => c.id === form.clientId);
    const number = state.numbers.find((n) => n.id === form.numberId);
    if (!number) return alert("নম্বর সিলেক্ট করুন");

    const tx = {
      id: uid("tx"),
      date: form.date,
      channel: form.channel,
      type: form.type,
      numberType: form.numberType,
      numberId: number.id,
      numberLabel: number.label,
      clientId: client?.id || "",
      clientName: client?.name || "",
      amount: clamp2(form.amount),
      commission: clamp2(
        form.numberType === "Agent" ? form.commission : form.commission || 0
      ),
      note: form.note || "",
    };

    const next = {
      ...state,
      transactions: [...state.transactions, tx],
      logs: [
        ...state.logs,
        {
          id: uid("log"),
          ts: new Date().toISOString(),
          msg: `লেনদেন সংরক্ষণ: ${tx.channel} ${tx.type} ৳${tx.amount}`,
        },
      ],
    };

    // Simulate SMS send
    if (state.sms.enabled && client?.name) {
      const sms = {
        id: uid("sms"),
        date: new Date().toISOString(),
        to: client.name,
        body: `${client.name}: ${tx.channel} ${tx.type} ৳${tx.amount} | কমিশন ৳${tx.commission}`,
        txId: tx.id,
        status: "queued",
      };
      next.sms = { ...state.sms, outbox: [...state.sms.outbox, sms] };
      next.logs.push({
        id: uid("log"),
        ts: new Date().toISOString(),
        msg: `SMS queued → ${client.name}`,
      });
    }

    dispatch({ type: "SAVE", payload: next });

    setForm((f) => ({
      ...f,
      amount: "",
      commission: f.numberType === "Agent" ? 0 : "",
      note: "",
    }));
  }

  return (
    <section className="grid lg:grid-cols-5 gap-6 mt-10">
      {/* LEFT: Create Transaction */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/90 dark:bg-gray-900/80 backdrop-blur shadow-lg">
        {/* top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
        <div className="p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            নতুন ট্রান্সাকশন
          </h3>

          <form className="space-y-4" onSubmit={addTx}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="তারিখ">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                  required
                />
              </Field>
              <Field label="চ্যানেল">
                <select
                  value={form.channel}
                  onChange={(e) =>
                    setForm({ ...form, channel: e.target.value })
                  }
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

            <div className="grid grid-cols-2 gap-3">
              <Field label="টাইপ">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                >
                  {["Cash In", "Cash Out", "Bill Payment"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="নম্বর টাইপ">
                <select
                  value={form.numberType}
                  onChange={(e) =>
                    setForm({ ...form, numberType: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                >
                  {["Agent", "Personal"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="নম্বর">
              <select
                value={form.numberId}
                onChange={(e) => setForm({ ...form, numberId: e.target.value })}
                className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                required
              >
                <option value="">— সিলেক্ট —</option>
                {numberChoices.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="অ্যামাউন্ট (৳)">
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                  required
                />
              </Field>
              <Field
                label={`কমিশন (৳) ${
                  form.numberType === "Agent" ? "— অটো" : "— ম্যানুয়াল"
                }`}
              >
                <input
                  type="number"
                  step="0.01"
                  value={form.commission}
                  onChange={(e) =>
                    setForm({ ...form, commission: e.target.value })
                  }
                  className={`w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                          focus:outline-none ${
                            form.numberType === "Agent"
                              ? "opacity-60 cursor-not-allowed"
                              : "focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                          }`}
                  disabled={form.numberType === "Agent"}
                  required={form.numberType !== "Agent"}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="ক্লায়েন্ট">
                <select
                  value={form.clientId}
                  onChange={(e) => {
                    const clientId = e.target.value;
                    const client = state.clients.find((c) => c.id === clientId);
                    setForm({
                      ...form,
                      clientId,
                      number: client ? client.number || "" : "",
                    });
                  }}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-[#862C8A] focus:border-transparent"
                >
                  <option value="">— অপশনাল —</option>
                  {state.clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="নম্বর">
                <input
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-[#009C91] focus:border-transparent"
                  placeholder="নম্বর"
                />
              </Field>
            </div>

            <div className="pt-2">
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

      {/* RIGHT: Transactions */}
      <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/90 dark:bg-gray-900/80 backdrop-blur shadow-lg">
        {/* top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
        <div className="p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            সব ট্রান্সাকশন
          </h3>

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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300">
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-1 rounded bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
                      তারিখ
                    </span>
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    চ্যানেল
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    টাইপ
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    নম্বর
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ক্লায়েন্ট
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    অ্যামাউন্ট
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    কমিশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="transition-colors hover:bg-gradient-to-r hover:from-[#862C8A]/5 hover:to-[#009C91]/5"
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {t.date}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {t.channel}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${
                      t.type === "Cash In"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : t.type === "Cash Out"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {t.numberLabel}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      {t.clientName || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      ৳{fmtBDT(t.amount)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                      ৳{fmtBDT(t.commission)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10">
                      <div className="mx-auto max-w-sm text-center">
                        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-r from-[#862C8A] to-[#009C91] opacity-90" />
                        <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          কোন ট্রান্সাকশন নেই
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          নতুন ট্রান্সাকশন যোগ করলে এখানে দেখা যাবে।
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
