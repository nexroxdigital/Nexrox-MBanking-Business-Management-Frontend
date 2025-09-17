import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Field } from "./Field";
import { clamp2, computeBalances, fmtBDT, uid } from "./utils";

export default function Settings({ ctx }) {
  const { state, dispatch } = ctx;
  const [num, setNum] = useState({
    label: "",
    number: "",
    channel: "Bkash",
    kind: "Agent",
  });

  const [adjustOpenId, setAdjustOpenId] = useState(null);
  const [adjustValue, setAdjustValue] = useState("");

  console.log(state);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // Close on outside click / Esc
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setMenuOpenId(null);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const openAdjust = (id) => {
    setAdjustOpenId(id);
    setAdjustValue("");
  };

  // submit
  const submitAdjust = () => {
    const delta = Number(adjustValue || 0);
    doAdjust(adjustOpenId, delta);
    setAdjustOpenId(null);
    setAdjustValue("");
  };

  // esc to close
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setAdjustOpenId(null);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  function addNumber() {
    if (!num.label.trim()) return;
    const entry = {
      id: uid("num"),
      label: num.label.trim(),
      number: num.number,
      channel: num.channel,
      kind: num.kind,
      manualAdj: 0,
    };
    const next = {
      ...state,
      numbers: [...state.numbers, entry],
      logs: [
        ...state.logs,
        {
          id: uid("log"),
          ts: new Date().toISOString(),
          msg: `নতুন নম্বর: ${entry.label}`,
        },
      ],
    };
    dispatch({ type: "SAVE", payload: next });
    setNum({ label: "", number: "", channel: num.channel, kind: num.kind });
  }

  function removeNumber(id) {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই নম্বরটি মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        const next = {
          ...state,
          numbers: state.numbers.filter((n) => n.id !== id),
          logs: [
            ...state.logs,
            {
              id: uid("log"),
              ts: new Date().toISOString(),
              msg: `নম্বর মুছে ফেলা হয়েছে`,
            },
          ],
        };

        dispatch({ type: "SAVE", payload: next });

        Swal.fire({
          title: "ডিলিট হয়েছে!",
          text: "নম্বরটি সফলভাবে ডিলিট করা হয়েছে।",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  // keep this helper in your component
  const doAdjust = (id, delta) => {
    const nextNums = state.numbers.map((n) =>
      n.id === id ? { ...n, manualAdj: clamp2((n.manualAdj || 0) + delta) } : n
    );
    const next = {
      ...state,
      numbers: nextNums,
      logs: [
        ...state.logs,
        {
          id: uid("log"),
          ts: new Date().toISOString(),
          msg: `ব্যালেন্স অ্যাডজাস্ট: ${delta}`,
        },
      ],
    };
    dispatch({ type: "SAVE", payload: next });
  };

  const balances = computeBalances(state.numbers, state.transactions);

  return (
    <section className="mt-10">
      {/* ===== Number Settings ===== */}
      <div className="rounded-2xl border border-gray-300 shadow-sm overflow-hidden bg-white">
        {/* Gradient Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        >
          <h3 className="font-semibold text-white tracking-wide">
            নম্বর সেটিংস
          </h3>
          <span className="text-xs px-2 py-1 rounded-lg bg-white/15 text-white/90">
            Manage numbers
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Fields */}
          <div className="flex flex-col md:flex-row gap-3">
            <Field label="লেবেল">
              <input
                className="border rounded-xl px-3 py-2 bg-white/90 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#862C8A33] max-w-[220px]"
                style={{
                  borderImageSlice: 1,
                  borderImageSource:
                    "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                value={num.label}
                onChange={(e) => setNum({ ...num, label: e.target.value })}
                placeholder="Bkash Agent 02"
              />
            </Field>

            <Field label="ফোন নম্বর">
              <input
                className="border rounded-xl px-3 py-2 bg-white/90 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#862C8A33] max-w-[220px]"
                style={{
                  borderImageSlice: 1,
                  borderImageSource:
                    "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                value={num.number}
                onChange={(e) => setNum({ ...num, number: e.target.value })}
                placeholder="018..."
              />
            </Field>

            <Field label="চ্যানেল">
              <select
                className="border rounded-xl px-3 py-1.5 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
                style={{
                  borderImageSlice: 1,
                  borderImageSource:
                    "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                value={num.channel}
                onChange={(e) => setNum({ ...num, channel: e.target.value })}
              >
                {["Bkash", "Nagad", "Rocket", "Bill Payment"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="টাইপ">
              <select
                className="border rounded-xl px-3 py-1.5 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
                style={{
                  borderImageSlice: 1,
                  borderImageSource:
                    "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                value={num.kind}
                onChange={(e) => setNum({ ...num, kind: e.target.value })}
              >
                {["Agent", "Personal"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Add button */}
          <div className="mt-4">
            <button
              className="px-4 py-2 rounded-xl text-white shadow-sm hover:shadow transition"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
              onClick={addNumber}
            >
              যোগ করুন
            </button>
          </div>

          {/* Numbers List */}
          <div className="mt-6">
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {state.numbers.length > 0 ? (
                state.numbers.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{
                              background:
                                "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                            }}
                          />
                          <span className="truncate">{n.label}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {n.number}
                        </div>
                      </div>

                      <div>
                        <span
                          className="inline-block px-3 py-1 rounded-lg font-semibold text-gray-900 whitespace-nowrap"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                          }}
                        >
                          ৳{fmtBDT(balances[n.id] || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2 justify-end">
                      <button
                        className="px-3 py-1.5 rounded-lg text-gray-700 transition border"
                        onClick={() => openAdjust(n.id)}
                        style={{
                          borderImageSlice: 1,
                          borderImageSource:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        Adjust
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg text-gray-700 transition border"
                        onClick={() => removeNumber(n.id)}
                        style={{
                          borderImageSlice: 1,
                          borderImageSource:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 rounded-xl border border-gray-100 text-gray-400">
                  কোন নম্বর নেই
                </div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 mt-0">
              <table className="w-full text-sm table-fixed ">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur sticky top-0 rounded-l-xl">
                      লেবেল
                    </th>
                    <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur">
                      ফোন নম্বর
                    </th>
                    <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur">
                      টাইপ
                    </th>
                    <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur ">
                      ব্যালেন্স
                    </th>
                    <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur rounded-r-xl">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {state.numbers.map((n) => (
                    <tr
                      key={n.id}
                      className="group rounded-xl border border-gray-100 bg-white hover:shadow-sm transition"
                    >
                      <td className="py-2 px-4 rounded-l-xl">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="" title={n.label}>
                            {n.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4">{n.number}</td>
                      <td className="py-2 px-4">{n.kind}</td>
                      <td className="py-2 px-4 text-right">
                        ৳{fmtBDT(balances[n.id] || 0)}
                      </td>
                      <td className="py-2 px-4 text-right rounded-r-xl relative">
                        <div className="flex justify-end gap-2">
                          <button
                            autoFocus
                            className="px-3 py-2 rounded-lg text-gray-700 transition border text-left hover:bg-white"
                            onClick={() => {
                              setMenuOpenId(null);
                              openAdjust(n.id);
                            }}
                          >
                            Adjust
                          </button>

                          <button
                            className="px-3 py-2 rounded-lg text-gray-700 transition border text-left hover:bg-white"
                            onClick={() => {
                              setMenuOpenId(null);
                              removeNumber(n.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {state.numbers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-400"
                      >
                        কোন নম্বর নেই
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {adjustOpenId && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/30"
                  aria-hidden="true"
                />
                {/* Dialog */}
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Manual balance adjust"
                  className="relative w-full max-w-sm mx-4 rounded-2xl shadow-xl border bg-white"
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
                      background:
                        "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                    }}
                  />

                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">
                        ম্যানুয়াল অ্যাডজাস্ট
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        ধনাত্মক (+) বা ঋণাত্মক (−) মান দিন। উদাহরণ: 500 বা -200
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <input
                        autoFocus
                        type="number"
                        inputMode="decimal"
                        step="any"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border focus:ring-1"
                        placeholder="৳ পরিমাণ (যেমন: 500 বা -200)"
                        value={adjustValue}
                        onChange={(e) => setAdjustValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitAdjust();
                        }}
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                          onClick={() => setAdjustOpenId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition"
                          onClick={submitAdjust}
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /* ===== SMS Integration (Demo) ===== */
}
// <div className="rounded-2xl border border-gray-300 shadow-sm overflow-hidden bg-white">

//   <div
//     className="px-5 py-4 flex items-center justify-between"
//     style={{
//       background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
//     }}
//   >
//     <h3 className="font-semibold text-white tracking-wide">
//       SMS ইন্টিগ্রেশন
//     </h3>
//     <span className="text-xs px-2 py-1 rounded-lg bg-white/15 text-white/90">
//       Beta
//     </span>
//   </div>

//   {/* Body */}
//   <div className="p-5">
//     {/* Fields */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//       <Field label="সক্রিয়">
//         <select
//           className="border rounded-xl px-3 py-2 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
//           style={{
//             borderImageSlice: 1,
//             borderImageSource:
//               "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
//             borderWidth: "1px",
//             borderStyle: "solid",
//           }}
//           value={sms.enabled ? "yes" : "no"}
//           onChange={(e) =>
//             setSms({ ...sms, enabled: e.target.value === "yes" })
//           }
//         >
//           <option value="no">না</option>
//           <option value="yes">হ্যাঁ</option>
//         </select>
//       </Field>

//       <Field label="Sender ID">
//         <input
//           className="border rounded-xl px-3 py-2 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
//           style={{
//             borderImageSlice: 1,
//             borderImageSource:
//               "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
//             borderWidth: "1px",
//             borderStyle: "solid",
//           }}
//           value={sms.senderId}
//           onChange={(e) => setSms({ ...sms, senderId: e.target.value })}
//           placeholder="যেমন: MBM"
//         />
//       </Field>

//       <Field label="API Key">
//         <input
//           className="border rounded-xl px-3 py-2 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
//           style={{
//             borderImageSlice: 1,
//             borderImageSource:
//               "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
//             borderWidth: "1px",
//             borderStyle: "solid",
//           }}
//           value={sms.apiKey}
//           onChange={(e) => setSms({ ...sms, apiKey: e.target.value })}
//           placeholder="••••••"
//         />
//       </Field>
//     </div>

//     {/* Save button */}
//     <div className="mt-4">
//       <button
//         className="px-4 py-2 rounded-xl text-white shadow-sm hover:shadow transition"
//         style={{
//           background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
//         }}
//         onClick={saveSms}
//       >
//         সেভ
//       </button>
//     </div>

//     {/* Outbox */}
//     <div className="mt-6">
//       <h4 className="font-medium">Outbox</h4>
//       <ul className="mt-2 space-y-2 max-h-64 overflow-auto pr-2 text-sm">
//         {state.sms.outbox
//           .slice()
//           .reverse()
//           .map((m) => (
//             <li
//               key={m.id}
//               className="relative border rounded-xl p-3 bg-white hover:shadow-sm transition"
//             >
//               {/* Gradient accent bar */}
//               <span
//                 className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
//                 style={{
//                   background:
//                     "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
//                 }}
//               />
//               <div className="flex items-center justify-between">
//                 <div className="text-xs text-gray-500">
//                   {new Date(m.date).toLocaleString()}
//                 </div>
//                 <div className="text-xs">
//                   Status:{" "}
//                   <span
//                     className="px-2 py-0.5 rounded-md"
//                     style={{
//                       background:
//                         "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
//                     }}
//                   >
//                     {m.status}
//                   </span>
//                 </div>
//               </div>
//               <div className="text-sm mt-1">
//                 To: <span className="font-medium">{m.to}</span>
//               </div>
//               <div className="text-xs text-gray-600 mt-1">{m.body}</div>
//             </li>
//           ))}
//         {state.sms.outbox.length === 0 && (
//           <li className="text-gray-400">খালি</li>
//         )}
//       </ul>
//     </div>
//   </div>
// </div>
