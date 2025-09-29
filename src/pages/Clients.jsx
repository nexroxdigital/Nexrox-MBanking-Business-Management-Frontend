import { useEffect, useMemo, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { ClientsColumns } from "../components/columns/ClientsColumns";
import TableComponent from "../components/shared/Table/Table";
import { clientsData } from "../data/clientsData";
import { clamp2, fmtBDT, todayISO, uid } from "./utils";

function computeClientStats(clients) {
  const byClient = {};
  let totalDue = 0;

  clients.forEach((c) => {
    byClient[c.id] = {
      sell: Number(c.totalSell || 0),
      paid: Number(c.paid || 0),
      due: Number(c.due || 0),
    };
    totalDue += Number(c.due || 0);
  });

  return { byClient, totalDue };
}

export default function Clients() {
  const [clients, setClients] = useState(clientsData);
  const [transactions, setTransactions] = useState([
    {
      id: "tx_1",
      clientId: "client_88fgyn2",
      clientName: "Mita Store",
      date: "2025-01-15",
      channel: "Bkash",
      type: "Cash In",
      numberType: "Agent",
      numberLabel: "Agent 01",
      amount: 2000,
      commission: 30,
      profit: 30,
      total: 2030,
      note: "First payment",
    },
    {
      id: "tx_2",
      clientId: "client_88fgyn2",
      clientName: "Mita Store",
      date: "2025-02-10",
      channel: "Nagad",
      type: "Cash Out",
      numberType: "Personal",
      numberLabel: "Personal 02",
      amount: 1500,
      commission: 20,
      profit: 20,
      total: 1520,
      note: "Second payment",
    },
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [editClient, setEditClient] = useState({ name: "", number: "" });

  function openEditModal(clientId) {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    setEditClientId(clientId);

    // Copy everything except id & payments
    const { id, payments, ...editableFields } = client;
    setEditClient(editableFields);

    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditClientId(null);
    setEditClient({ name: "", number: "" });
  }

  function updateClient() {
    if (!editClient.name.trim() || !editClient.number) return;

    setClients((prev) =>
      prev.map((c) =>
        c.id === editClientId
          ? { ...c, ...editClient, name: editClient.name.trim() } // keep payments, id untouched
          : c
      )
    );

    closeEditModal();
  }

  const computed = useMemo(() => computeClientStats(clients), [clients]);

  const [newClient, setNewClient] = useState({
    name: "",
    number: "",
  });
  const [selected, setSelected] = useState(null);

  // const computed = useMemo(() => computeClientStats(state), [state]);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payClientId, setPayClientId] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // open from button
  const openPayModal = (clientId) => {
    setPayClientId(clientId);
    setPayAmount("");
    setPayNote("");
    setPayModalOpen(true);
  };

  const closePayModal = () => {
    setPayModalOpen(false);
    setPayClientId(null);
    setPayAmount("");
    setPayNote("");
  };

  const openAddModal = () => {
    setNewClient({ name: "", number: "" });
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  // submit (same data rules as your original: amount must be > 0 after clamp2)
  const submitPayModal = () => {
    const amount = clamp2(payAmount);
    if (!amount || amount <= 0) return; // keep same behavior: do nothing if invalid
    addPayment(payClientId, amount, payNote || "");
    closePayModal();
  };

  // esc to close
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        if (payModalOpen) closePayModal();
        if (addModalOpen) closeAddModal();
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [payModalOpen, addModalOpen]);

  function addClient() {
    if (!newClient.name.trim() || !newClient.number) return;
    const c = {
      id: uid("client"),
      name: newClient.name.trim(),
      number: newClient.number,
      payments: [],
    };
    setClients((prev) => [...prev, c]);
    setNewClient({ name: "", number: "" });
    setAddModalOpen(false);
  }

  function addPayment(clientId, amount, note = "") {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;

        const newPaid = (c.paid || 0) + Number(amount);
        const newDue = Math.max(0, (c.totalSell || 0) - newPaid);

        return {
          ...c,
          paid: newPaid,
          due: newDue,
          payments: [
            ...(c.payments || []),
            { id: uid("pay"), date: todayISO(), amount, note },
          ],
        };
      })
    );
  }

  const rows = clients.map((c) => {
    const totalSell = computed.byClient[c.id]?.sell || 0;
    const paid = (c.payments || []).reduce(
      (s, p) => s + Number(p.amount || 0),
      0
    );
    const due = Math.max(0, totalSell - paid);
    return { id: c.id, name: c.name, totalSell, paid, due };
  });

  console.log("rowssssss", rows);

  const selClient = clients.find((c) => c.id === selected);
  const selTx = transactions
    .filter((t) => t.clientId === selected)
    .sort((a, b) => b.date.localeCompare(a.date));

  // delete client handler
  function deleteClient(clientId) {
    const client = clients.find((c) => c.id === clientId);

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${client?.name || "এই ক্লায়েন্ট"} ডিলিট হয়ে যাবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
        setTransactions((prev) =>
          prev.map((t) =>
            t.clientId === clientId
              ? {
                  ...t,
                  clientId: null,
                  clientName: client?.name || "(Deleted Client)",
                }
              : t
          )
        );

        if (selected === clientId) setSelected(null);

        Swal.fire({
          title: "ডিলিট হয়েছে!",
          text: "ক্লায়েন্ট সফলভাবে ডিলিট করা হয়েছে।",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

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
          <h3 className="font-semibold text-white tracking-wide text-lg md:text-xl sm:text-base">
            ক্লায়েন্ট তালিকা
          </h3>
          <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
            <button
              className="px-5 md:px-3 py-2 rounded-xl text-white shadow-sm hover:shadow transition text-sm whitespace-nowrap self-center"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
              onClick={openAddModal}
            >
              ক্লায়েন্ট যোগ করুন
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

                  <button
                    className="text-red-600 hover:bg-red-50 transition relative flex items-center justify-center"
                    title="Delete Client"
                    onClick={() => deleteClient(r.id)}
                  >
                    <MdDeleteOutline size={20} />
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

                <div className="grid grid-cols-2 gap-3 text-xs">
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
                    onClick={() => openPayModal(r.id)}
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
          <TableComponent
            data={clients}
            columns={ClientsColumns(
              setSelected,
              openPayModal,
              deleteClient,
              openEditModal
            )}
          />

          {addModalOpen && (
            <div className="fixed inset-0 z-[125] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/30"
                aria-hidden="true"
                onClick={closeAddModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Add client"
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
                  <h4 className="font-medium text-gray-900">নতুন ক্লায়েন্ট</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    নাম ও মোবাইল নম্বর দিন।
                  </p>

                  {/* Form*/}
                  <form
                    onSubmit={(e) => {
                      const formEl = e.currentTarget;
                      if (!formEl.reportValidity()) {
                        e.preventDefault();
                        return;
                      }
                      e.preventDefault();
                      addClient();
                    }}
                    className="mt-4 grid gap-3"
                  >
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        নাম
                      </label>
                      <input
                        autoFocus
                        required
                        type="text"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border border-[#6314698e] focus:ring-2 focus:ring-[#862C8A33]"
                        placeholder="যেমন: Rahim"
                        value={newClient.name}
                        onChange={(e) =>
                          setNewClient((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        মোবাইল নম্বর
                      </label>
                      <input
                        required
                        type="tel"
                        pattern="01[0-9]{9}" // optional BD format
                        title="Valid BD mobile: 11 digits, starts with 01"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border focus:ring-2 border-[#6314698e] focus:ring-[#862C8A33]"
                        placeholder="যেমন: 018XXXXXXXX"
                        value={newClient.number}
                        onChange={(e) =>
                          setNewClient((prev) => ({
                            ...prev,
                            number: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                        onClick={closeAddModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {payModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={payModalOpen}
                aria-hidden="true"
              />
              {/* Dialog */}
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Add payment"
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
                  <h4 className="font-medium text-gray-900">পেমেন্ট অ্যাড</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    পরিমাণ দিন (৳). ধনাত্মক সংখ্যা হতে হবে।
                  </p>

                  <div className="mt-4 grid gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        পরিমাণ (৳)
                      </label>
                      <input
                        autoFocus
                        type="number"
                        inputMode="decimal"
                        step="any"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none focus:outline-none border-none"
                        style={{
                          borderImageSlice: 1,
                          borderImageSource:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                        placeholder="যেমন: 500"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitPayModal();
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        নোট (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none"
                        style={{
                          borderImageSlice: 1,
                          borderImageSource:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                        placeholder="যেমন: মার্চেন্ট পেমেন্ট"
                        value={payNote}
                        onChange={(e) => setPayNote(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                        onClick={closePayModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition disabled:opacity-50"
                        onClick={submitPayModal}
                        disabled={!clamp2(payAmount) || clamp2(payAmount) <= 0} // same rule as original
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

          {editModalOpen && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/30"
                aria-hidden="true"
                onClick={closeEditModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Edit client"
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
                  <h4 className="font-medium text-gray-900">
                    ক্লায়েন্ট সম্পাদনা করুন
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    নাম ও মোবাইল নম্বর আপডেট করুন।
                  </p>

                  {/* Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateClient();
                    }}
                    className="mt-4 grid gap-3"
                  >
                    {/* Name */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        নাম
                      </label>
                      <input
                        autoFocus
                        required
                        type="text"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border border-[#6314698e] focus:ring-2 focus:ring-[#862C8A33]"
                        placeholder="যেমন: Rahim"
                        value={editClient.name}
                        onChange={(e) =>
                          setEditClient((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Number */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        মোবাইল নম্বর
                      </label>
                      <input
                        required
                        type="tel"
                        pattern="01[0-9]{9}"
                        title="Valid BD mobile: 11 digits, starts with 01"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border focus:ring-2 border-[#6314698e] focus:ring-[#862C8A33]"
                        placeholder="যেমন: 018XXXXXXXX"
                        value={editClient.number}
                        onChange={(e) =>
                          setEditClient((prev) => ({
                            ...prev,
                            number: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                        onClick={closeEditModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
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
          <h3 className="font-semibold text-white tracking-wide text-lg md:text-xl">
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
              বাম পাশ থেকে একটি ক্লায়েন্ট সিলেক্ট করুন
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
                    নম্বর: {selClient.number}
                  </div>
                  <div className="text-xs text-gray-500">
                    মোট {selTx.length} ট্রান্সাকশন
                  </div>
                </div>
              </div>

              {/* Timeline list */}
              <ul className="mt-4 space-y-3 h-full overflow-auto pr-2 text-sm">
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
