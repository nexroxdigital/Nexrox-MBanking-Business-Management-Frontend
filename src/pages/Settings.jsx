import { useState } from "react";
import Swal from "sweetalert2";
import { numbersData } from "../data/numbersData";
import { Field } from "./Field";
import { clamp2, fmtBDT, uid } from "./utils";

// function computeBalances(numbers) {
//   // Just return manualAdj as the balance for each number
//   return Object.fromEntries(
//     numbers.map((n) => [n.id, Number(n.manualAdj || 0)])
//   );
// }

export default function Settings({ onClose }) {
  const [numbers, setNumbers] = useState(numbersData);

  const [num, setNum] = useState({
    label: "",
    number: "",
    channel: "Bkash",
    type: "Agent",
    balance: 0
  });

  const [adjustOpenId, setAdjustOpenId] = useState(null);
  const [adjustValue, setAdjustValue] = useState("");
  const [addOpen, setAddOpen] = useState(false);

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

  function addNumber() {
    if (!num.label.trim() || !num.number.trim() || !num.channel || !num.kind) {
      Swal.fire({
        icon: "error",
        title: "সব তথ্য পূরণ করুন",
        text: "লেবেল, নম্বর, চ্যানেল এবং টাইপ সবগুলো প্রয়োজনীয়।",
      });
      return;
    }

    const entry = {
      id: uid("num"),
      label: num.label.trim(),
      number: num.number,
      channel: num.channel,
      kind: num.kind,
      manualAdj: 0,
    };

    setNumbers((prev) => [...prev, entry]);
    setNum({ label: "", number: "", channel: num.channel, kind: num.kind });
    setAddOpen(false);
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
        setNumbers((prev) => prev.filter((n) => n.id !== id));

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

  const doAdjust = (id, delta) => {
    setNumbers((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, balance: clamp2((n.balance || 0) + delta) } : n
      )
    );
  };

  // const balances = computeBalances(numbers);

  return (
    <section className="">
      {/* ===== Number Settings ===== */}
      <div className="rounded-2xl border border-gray-300 shadow-sm overflow-hidden bg-white">
        {/* Gradient Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        >
          <h3 className="font-semibold text-white tracking-wide text-lg md:text-2xl">
            নম্বর সেটিংস
          </h3>
          {/* <span className="text-xs px-2 py-1 rounded-lg bg-white/15 text-white/90">
            Manage numbers
          </span> */}
          <div className="">
            <button
              className="px-4 py-2 rounded-xl text-white shadow-sm hover:shadow transition"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
              onClick={() => setAddOpen(true)}
            >
              নম্বর যোগ করুন
            </button>
            <button
              className="px-4 py-2 rounded-xl text-white shadow-sm hover:shadow transition"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
              onClick={onClose}
            >
              ফিরে যান
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Numbers List */}
          <div className="mt-6">
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {numbers.length > 0 ? (
                numbers.map((n) => (
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
                          ৳{fmtBDT(n.balance || 0)}
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
            <div className="hidden md:block overflow-x-auto border border-gray-100 mt-0">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="text-left bg-[#6314698e] border border-gray-300 border-b-0 border-l border-l-gray-400 border-r border-r-gray-400">
                    <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur sticky top-0 border-r border-r-gray-200">
                      লেবেল
                    </th>
                    <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur border-r border-r-gray-200">
                      ফোন নম্বর
                    </th>
                    <th className="py-2 px-4 text-gray-600 bg-white/85 backdrop-blur border-r border-r-gray-200">
                      টাইপ
                    </th>
                    <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur border-r border-r-gray-200">
                      ব্যালেন্স
                    </th>
                    <th className="py-2 px-4 text-right text-gray-600 bg-white/85 backdrop-blur">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {numbers.map((n) => (
                    <tr
                      key={n.id}
                      className="group rounded-xl border border-gray-300 bg-white hover:shadow-sm transition"
                    >
                      <td className="py-2 px-4 rounded-l-xl border-r border-r-gray-300">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="" title={n.label}>
                            {n.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-r border-r-gray-300">
                        {n.number}
                      </td>
                      <td className="py-2 px-4 border-r border-r-gray-300">
                        {n.type}
                      </td>
                      <td className="py-2 px-4 text-right border-r border-r-gray-300">
                        ৳{fmtBDT(n.balance || 0)}
                      </td>
                      <td className="py-2 px-4 text-right rounded-r-xl relative ">
                        <div className="flex justify-end gap-2">
                          <button
                            autoFocus
                            className="px-3 py-2 rounded-lg text-gray-700 transition border text-left hover:bg-white"
                            onClick={() => {
                              openAdjust(n.id);
                            }}
                          >
                            Adjust
                          </button>

                          <button
                            className="px-3 py-2 rounded-lg text-gray-700 transition border text-left hover:bg-white"
                            onClick={() => {
                              removeNumber(n.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {numbers.length === 0 && (
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

            {addOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/30"
                  aria-hidden="true"
                  onClick={() => setAddOpen(false)}
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Add new number"
                  className="relative w-full max-w-md mx-4 rounded-t-xl shadow-xl border bg-white"
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
                        নতুন নম্বর যোগ করুন
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        প্রয়োজনীয় তথ্য পূরণ করে Submit চাপুন।
                      </p>
                    </div>

                    {/* fields */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addNumber();
                      }}
                    >
                      <div className="grid grid-cols-1 gap-3">
                        <Field label="লেবেল">
                          <input
                            required
                            autoFocus
                            className="border border-[#6314698e] rounded-xl px-3 py-2 bg-white/90 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#862C8A33] w-full"
                            value={num.label}
                            onChange={(e) =>
                              setNum({ ...num, label: e.target.value })
                            }
                            placeholder="Bkash Agent 02"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addNumber(); // submit on enter
                            }}
                          />
                        </Field>

                        <Field label="ফোন নম্বর">
                          <input
                            className="border border-[#6314698e] rounded-xl px-3 py-2 bg-white/90 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#862C8A33] w-full"
                            value={num.number}
                            onChange={(e) =>
                              setNum({ ...num, number: e.target.value })
                            }
                            placeholder="018..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addNumber();
                            }}
                            required
                          />
                        </Field>

                        <div className="flex gap-5">
                          <Field label="চ্যানেল">
                            <select
                              required
                              className="border  border-[#6314698e] rounded-xl px-3 py-1.5 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
                              value={num.channel}
                              onChange={(e) =>
                                setNum({ ...num, channel: e.target.value })
                              }
                            >
                              {["Bkash", "Nagad", "Rocket", "Bill Payment"].map(
                                (c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                )
                              )}
                            </select>
                          </Field>

                          <Field label="টাইপ">
                            <select
                              required
                              className="border border-[#6314698e] rounded-xl px-3 py-1.5 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
                              value={num.kind}
                              onChange={(e) =>
                                setNum({ ...num, kind: e.target.value })
                              }
                            >
                              {["Agent", "Personal"].map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      </div>

                      {/* modal actions */}
                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setAddOpen(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition cursor-pointer"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          }}
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {adjustOpenId && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/30"
                  aria-hidden="true"
                  onClick={() => setAdjustOpenId(null)}
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
