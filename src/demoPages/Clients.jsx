import { useMemo, useState } from "react";
import { clamp2, computeClientStats, fmtBDT, todayISO, uid } from "./utils";

export default function Clients({ ctx }) {
  const { state, dispatch } = ctx;
  const [newClient, setNewClient] = useState("");
  const [selected, setSelected] = useState(null);
  const computed = useMemo(() => computeClientStats(state), [state]);

  function addClient() {
    if (!newClient.trim()) return;
    const c = { id: uid("client"), name: newClient.trim(), payments: [] };
    const next = {
      ...state,
      clients: [...state.clients, c],
      logs: [
        ...state.logs,
        {
          id: uid("log"),
          ts: new Date().toISOString(),
          msg: `নতুন ক্লায়েন্ট: ${c.name}`,
        },
      ],
    };
    dispatch({ type: "SAVE", payload: next });
    setNewClient("");
  }

  function addPayment(clientId) {
    const amt = prompt("পেমেন্ট (৳)");
    const amount = clamp2(amt);
    if (!amount || amount <= 0) return;
    const note = prompt("নোট (ঐচ্ছিক)") || "";

    const clients = state.clients.map((c) => {
      if (c.id !== clientId) return c;
      const p = { id: uid("pay"), date: todayISO(), amount, note };
      return { ...c, payments: [...c.payments, p] };
    });

    const client = state.clients.find((c) => c.id === clientId);
    const next = {
      ...state,
      clients,
      logs: [
        ...state.logs,
        {
          id: uid("log"),
          ts: new Date().toISOString(),
          msg: `পেমেন্ট গ্রহণ: ${client?.name} ৳${amount}`,
        },
      ],
    };
    dispatch({ type: "SAVE", payload: next });
  }

  const rows = state.clients.map((c) => ({
    id: c.id,
    name: c.name,
    totalSell: computed.byClient[c.id]?.sell || 0,
    paid: (c.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0),
    due:
      (computed.byClient[c.id]?.sell || 0) -
      (c.payments || []).reduce((s, p) => s + Number(p.amount || 0), 0),
  }));

  const selClient = state.clients.find((c) => c.id === selected);
  const selTx = state.transactions
    .filter((t) => t.clientId === selected)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="grid md:grid-cols-5 gap-6 mt-10">
      {/* Left: Client List */}
      <div className="md:col-span-3 rounded-2xl border border-gray-200 shadow-sm p-0 overflow-hidden">
        {/* Gradient Header */}
        <div
          className="px-3 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        >
          <h3 className="font-semibold text-white tracking-wide text-sm sm:text-base">
            ক্লায়েন্ট তালিকা
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              className="flex-1 sm:flex-none px-2 sm:px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border border-white/60 focus:border-white focus:ring-2 focus:ring-white/60 transition text-sm"
              placeholder="নতুন ক্লায়েন্ট"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
            />
            <button
              className="px-2 sm:px-3 py-2 rounded-xl text-white shadow-sm hover:shadow transition text-sm whitespace-nowrap"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
              onClick={addClient}
            >
              যোগ করুন
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-5 bg-white">
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-3">
            {rows.map((r) => (
              <div
                key={r.id}
                className="group rounded-xl bg-gradient-to-r from-white to-white hover:from-white hover:to-white shadow-sm hover:shadow transition-all duration-200 border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <button
                    className="inline-flex items-center gap-2 font-medium text-gray-900 hover:opacity-90 transition flex-1"
                    onClick={() => setSelected(r.id)}
                    title="ট্রান্সাকশন দেখুন"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full opacity-70 group-hover:opacity-100 flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                      }}
                    />
                    <span className="truncate text-left">{r.name}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-gray-500 block">মোট বিক্রি</span>
                    <span className="text-gray-700 font-medium">
                      ৳{fmtBDT(r.totalSell)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">পেমেন্ট</span>
                    <span className="text-gray-700 font-medium">
                      ৳{fmtBDT(r.paid)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 block text-xs">পাওনা</span>
                    <span
                      className="inline-block px-2 py-1 rounded-lg font-semibold text-gray-900 text-xs"
                      style={{
                        background:
                          "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                      }}
                    >
                      ৳{fmtBDT(r.due)}
                    </span>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-white transition text-xs"
                    onClick={() => addPayment(r.id)}
                    style={{
                      borderImageSlice: 1,
                      borderImageSource:
                        "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="py-10 text-center text-gray-400">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(270deg, #862C8A33 0%, #009C9133 100%)",
                  }}
                >
                  <span className="text-xl opacity-80">👥</span>
                </div>
                <p className="text-sm">কোন ক্লায়েন্ট নেই</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full table-fixed border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-3 px-4 text-gray-600 sticky top-0 z-10 bg-white/80 backdrop-blur rounded-l-xl">
                    নাম
                  </th>
                  <th className="py-3 px-4 text-gray-600 text-right bg-white/80 backdrop-blur">
                    মোট বিক্রি
                  </th>
                  <th className="py-3 px-4 text-gray-600 text-right bg-white/80 backdrop-blur">
                    পেমেন্ট
                  </th>
                  <th className="py-3 px-4 text-gray-600 text-right bg-white/80 backdrop-blur">
                    পাওনা
                  </th>
                  <th className="py-3 px-4 text-gray-600 text-right sticky top-0 z-10 bg-white/80 backdrop-blur rounded-r-xl">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="group rounded-xl bg-gradient-to-r from-white to-white hover:from-white hover:to-white shadow-sm hover:shadow transition-all duration-200 border border-gray-100"
                  >
                    <td className="py-3 px-4 rounded-l-xl">
                      <button
                        className="inline-flex items-center gap-2 font-medium text-gray-900 hover:opacity-90 transition"
                        onClick={() => setSelected(r.id)}
                        title="ট্রান্সাকশন দেখুন"
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full opacity-70 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          }}
                        />
                        <span className="truncate">{r.name}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right text-gray-700">
                      ৳{fmtBDT(r.totalSell)}
                    </td>

                    <td className="py-3 px-4 text-right text-gray-700">
                      ৳{fmtBDT(r.paid)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className="inline-block px-2.5 py-1 rounded-lg font-semibold text-gray-900"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                        }}
                      >
                        ৳{fmtBDT(r.due)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right rounded-r-xl">
                      <button
                        className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-white transition relative"
                        onClick={() => addPayment(r.id)}
                        style={{
                          borderImageSlice: 1,
                          borderImageSource:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        Add Payment
                      </button>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400">
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A33 0%, #009C9133 100%)",
                        }}
                      >
                        <span className="text-2xl opacity-80">👥</span>
                      </div>
                      কোন ক্লায়েন্ট নেই
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: Client Transactions */}
      <div className="md:col-span-2 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Gradient Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        >
          <h3 className="font-semibold text-white tracking-wide">
            ক্লায়েন্টভিত্তিক ট্রান্সাকশন
          </h3>
          {selClient && (
            <button
              className="text-xs px-2 py-1 rounded-lg bg-white/90 text-gray-900 hover:bg-white transition"
              onClick={() => setSelected(null)}
            >
              Clear
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 bg-white">
          {!selClient && (
            <div className="text-gray-500 text-sm">
              বামে থেকে একটি ক্লায়েন্ট সিলেক্ট করুন
            </div>
          )}

          {selClient && (
            <div className="mt-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {selClient.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    মোট {selTx.length} ট্রান্সাকশন
                  </div>
                </div>
              </div>

              {/* Timeline list */}
              <ul className="mt-4 space-y-3 max-h-72 overflow-auto pr-2 text-sm">
                {selTx.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-xl border border-gray-100 p-3 hover:shadow-sm transition relative"
                  >
                    {/* Gradient accent bar */}
                    <span
                      className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
                      style={{
                        background:
                          "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                      }}
                    />

                    <div className="flex items-start justify-between gap-3 pl-2">
                      <div className="text-gray-700">
                        <div className="font-medium">
                          {t.date} · {t.channel} {t.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          কমিশন: ৳{fmtBDT(t.commission)} • {t.numberLabel}
                        </div>
                        {t.note && (
                          <div className="text-xs mt-1 text-gray-600">
                            নোট: {t.note}
                          </div>
                        )}
                      </div>

                      <div>
                        <span
                          className="inline-block px-3 py-1 rounded-lg font-semibold text-gray-900 whitespace-nowrap"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                          }}
                        >
                          ৳{fmtBDT(t.amount)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}

                {selTx.length === 0 && (
                  <li className="text-gray-400">কোন ট্রান্সাকশন নেই</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
