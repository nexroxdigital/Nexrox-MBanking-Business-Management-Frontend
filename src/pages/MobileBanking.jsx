import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MobileBankingColumns } from "../components/columns/MobileBankingColumns";
import Loading from "../components/shared/Loading/Loading";
import TableComponent from "../components/shared/Table/Table";
import { useToast } from "../hooks/useToast";
import { useCreateWalletNumber, useWalletNumbers } from "../hooks/useWallet";
import { Field } from "./Field";
import { clamp2, todayISO } from "./utils";

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MobileBanking = () => {
  const { showSuccess, showError } = useToast();
  // hook to post new wallet
  const createWallet = useCreateWalletNumber();
  const { data, isLoading, isError } = useWalletNumbers();

  const [addOpen, setAddOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [adjustValue, setAdjustValue] = useState("");

  const [wallets, setWallets] = useState([]);

  // sync query data into local state whenever it changes
  useEffect(() => {
    if (data) {
      setWallets(data);
    }
  }, [data]);

  const openAdjust = () => {
    setAdjustOpen(true);
    setSelectedWalletId(wallets[0]?.id || ""); // default first wallet
    setAdjustValue("");
  };

  const submitAdjust = () => {
    const delta = Number(adjustValue || 0);
    if (!selectedWalletId) return;

    setWallets((prev) =>
      prev.map((w) =>
        w.id === Number(selectedWalletId)
          ? { ...w, balance: clamp2((w.balance || 0) + delta) }
          : w
      )
    );

    setAdjustOpen(false);
    setSelectedWalletId("");
    setAdjustValue("");
  };

  const [num, setNum] = useState({
    label: "",
    number: "",
    channel: "Bkash",
    type: "Agent",
    balance: 0,
  });

  const [transactions] = useState([
    {
      date: todayISO(),
      sender: "017XXXXXXXX",
      receiver: "018XXXXXXXX",
      ref: "REF123",
      trxId: "TRX001",
      time: getCurrentTime(),
      amount: 1000,
      commission: 20,
      pay: 980,
      method: "ক্যাশ",
      balance: 1200,
    },
    {
      date: todayISO(),
      sender: "017XXXXXXXX",
      receiver: "018XXXXXXXX",
      ref: "REF123",
      trxId: "TRX001",
      time: getCurrentTime(),
      amount: 1000,
      commission: 20,
      pay: 980,
      method: "ক্যাশ",
      balance: 1300,
    },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    bank: "",
    number: "",
    type: "",
    balance: "",
  });

  console.log("waleet", data);

  // 🟢 Edit handler
  const handleEditMBank = (index) => {
    setEditIndex(index);
    setEditData(wallets[index]);
    setShowEditModal(true);
  };

  const handleUpdateMBank = () => {
    const updated = [...wallets];
    updated[editIndex] = editData;
    setWallets(updated);
    setShowEditModal(false);
    setEditIndex(null);
  };

  // 🟢 Delete handler
  const handleDeleteMBank = (index) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই মোবাইল ব্যাংকটি ডিলিট হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        setWallets(wallets.filter((_, i) => i !== index));
        Swal.fire({
          title: "ডিলিট হয়েছে!",
          text: "অপারেটরটি সফলভাবে ডিলিট হয়েছে।",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  function addNumber() {
    if (!num.label.trim() || !num.number.trim() || !num.channel || !num.type) {
      Swal.fire({
        icon: "error",
        title: "সব তথ্য পূরণ করুন",
        text: "লেবেল, নম্বর, চ্যানেল এবং টাইপ সবগুলো প্রয়োজনীয়।",
      });
      return;
    }

    const newWallet = {
      label: num.label.trim(),
      number: num.number,
      channel: num.channel,
      type: num.type,
      balance: 0,
    };

    setWallets((prev) => [...prev, newWallet]);

    createWallet.mutate(newWallet, {
      onSuccess: () => {
        showSuccess("Wallet number added!");
        setNum({
          label: "",
          number: "",
          channel: num.channel,
          type: num.type,
          balance: 0,
        });
      },
      onError: (err) => {
        showError(err.response?.data?.message || "Failed to add wallet number");
      },
    });

    setAddOpen(false);
  }

  return (
    <div className="mt-10">
      <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
      <div className="bg-white shadow-2xl rounded-2xl p-6 rounded-tr-none rounded-tl-none space-y-10 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            মোবাইল ব্যাংকিং
          </h1>

          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-xl text-white shadow-sm hover:shadow transition cursor-pointer"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
              onClick={() => {
                openAdjust();
              }}
            >
              অ্যাড ব্যালেন্স
            </button>

            <button
              className="px-4 py-2 rounded-xl text-white shadow-sm hover:shadow transition cursor-pointer"
              style={{
                background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              }}
              onClick={() => setAddOpen(true)}
            >
              নম্বর যোগ করুন
            </button>
          </div>
        </div>

        {/* Wallets List */}
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {wallets.map((w, i) => (
              <div
                key={i}
                className="relative group p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Edit/Delete Icons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleEditMBank(i)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <CiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteMBank(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdOutlineDelete size={20} />
                  </button>
                </div>

                {/* Top Section with Bank Name */}
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{w.label}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      w.type === "Agent"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {w.type}
                  </span>
                </div>

                {/* Number */}
                <p className="mt-4 text-gray-800 text-lg font-mono tracking-wide">
                  {w.number}
                </p>

                {/* Balance */}
                <div className="mt-4">
                  <span className="text-sm text-gray-500 font-semibold">
                    ব্যালেন্স
                  </span>
                  <p className="text-2xl font-bold text-green-600">
                    ৳{(w.balance ?? 0).toLocaleString("bn-BD")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions Table */}
        <TableComponent data={transactions} columns={MobileBankingColumns} />

        {/* 🟢 Edit Wallet Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
              <h2 className="text-xl font-bold mb-4">ওয়ালেট সম্পাদনা করুন</h2>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  value={editData.bank}
                  onChange={(e) =>
                    setEditData({ ...editData, bank: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  placeholder="ব্যাংক"
                />
                <input
                  type="text"
                  value={editData.number}
                  onChange={(e) =>
                    setEditData({ ...editData, number: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                  placeholder="নম্বর"
                />
                <select
                  value={editData.type}
                  onChange={(e) =>
                    setEditData({ ...editData, type: e.target.value })
                  }
                  className="w-full border rounded-lg p-3"
                >
                  <option value="এজেন্ট">এজেন্ট</option>
                  <option value="পার্সোনাল">পার্সোনাল</option>
                </select>
                <input
                  type="number"
                  value={editData.balance}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      balance: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg p-3"
                  placeholder="ব্যালেন্স"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateMBank}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    আপডেট করুন
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                          value={num.type}
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

        {adjustOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/30"
              aria-hidden="true"
              onClick={() => setAdjustOpen(false)}
            />
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
                    ওয়ালেট নির্বাচন করুন এবং ধনাত্মক (+) বা ঋণাত্মক (−) মান দিন।
                  </p>
                </div>

                <div className="grid gap-3">
                  <select
                    className="w-full px-3 py-2 rounded-xl border bg-white/90 text-gray-900 outline-none focus:ring-1"
                    value={selectedWalletId}
                    onChange={(e) => setSelectedWalletId(e.target.value)}
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label} ({w.number})
                      </option>
                    ))}
                  </select>

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
                      onClick={() => setAdjustOpen(false)}
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
  );
};

export default MobileBanking;
