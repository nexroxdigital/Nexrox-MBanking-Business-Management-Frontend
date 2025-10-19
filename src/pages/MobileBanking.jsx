import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MobileBankingColumns } from "../components/columns/MobileBankingColumns";
import { CardLoading } from "../components/shared/CardLoading/CardLoading";
import TableComponent from "../components/shared/Table/Table";
import { useDeleteDailyTxn, useGetTransactions } from "../hooks/useDailyTxn";
import { useToast } from "../hooks/useToast";
import {
  useAdjustWalletBalance,
  useCreateWalletNumber,
  useDeleteWalletNumber,
  useEditWalletNumber,
  useWalletNumbers,
} from "../hooks/useWallet";
import { Field } from "./Field";
import { clamp2 } from "./utils";

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
  //  Delete handler
  const deleteWallet = useDeleteWalletNumber();

  const { data, isLoading, isError } = useWalletNumbers();

  const editWallet = useEditWalletNumber();

  const [addOpen, setAddOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [adjustValue, setAdjustValue] = useState("");

  const adjustWalletBalance = useAdjustWalletBalance();

  const [wallets, setWallets] = useState([]);

  const deleteMutation = useDeleteDailyTxn();

  // sync query data into local state whenever it changes
  useEffect(() => {
    if (data) {
      setWallets(data);
    }
  }, [data]);

  const openAdjust = () => {
    setAdjustOpen(true);
    setSelectedWalletId(wallets[0]?._id || "");
    setAdjustValue("");
  };

  const submitAdjust = () => {
    // console.log("selectedWalletId:", selectedWalletId);
    const delta = Number(adjustValue || 0);
    if (!selectedWalletId || isNaN(delta)) return;

    // 🟢 Optimistic update
    setWallets((prev) =>
      prev.map((w) =>
        w.id === selectedWalletId
          ? { ...w, balance: clamp2((w.balance || 0) + delta) }
          : w
      )
    );

    // 🔄 Call backend
    adjustWalletBalance.mutate(
      { id: selectedWalletId, amount: delta },
      {
        onError: () => {
          // Rollback UI if error
          setWallets((prev) =>
            prev.map((w) =>
              w.id === selectedWalletId
                ? { ...w, balance: clamp2((w.balance || 0) - delta) }
                : w
            )
          );

          Swal.fire("ত্রুটি", "ব্যালেন্স আপডেট ব্যর্থ হয়েছে", "error");
        },
        // ✅ Success alert
        onSuccess: () => {
          Swal.fire({
            title: "সফল",
            text: "ব্যালেন্স সফলভাবে আপডেট হয়েছে!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        },
      }
    );

    setAdjustOpen(false);
    setSelectedWalletId("");
    setAdjustValue("");
  };

  const [num, setNum] = useState({
    label: "",
    number: "",
    channel: "বিকাশ",
    type: "Agent",
    balance: 0,
  });

  // console.log("type", num.type);

  const [transactions, setTransactions] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: txnData,
    isLoading: txnLoading,
    isFetching: txnFetching,
  } = useGetTransactions(pagination.pageIndex, pagination.pageSize);

  useEffect(() => {
    if (txnData?.data) {
      setTransactions(txnData?.data);
    }
  }, [txnData]);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editData, setEditData] = useState(null);

  const handleEditMBank = (id) => {
    const wallet = wallets.find((w) => w._id === id);
    if (!wallet) return;
    setEditData(wallet);
    setShowEditModal(true);
  };

  const handleUpdateMBank = () => {
    // console.log("Edit data:", editData);
    editWallet.mutate(
      {
        id: editData._id,
        walletData: {
          label: editData.label,
          number: editData.number,
          channel: editData.channel,
          type: editData.type,
          balance: editData.balance,
        },
      },
      {
        onMutate: async (updatedWallet) => {
          // Optimistic UI: update local state immediately
          setWallets((prev) =>
            prev.map((w) => (w._id === updatedWallet._id ? updatedWallet : w))
          );
        },
        onError: () => {
          // Rollback not needed here if you rely on queryClient.invalidateQueries
          // but you could restore prev state if you want
          Swal.fire("ত্রুটি", "ওয়ালেট আপডেট ব্যর্থ হয়েছে", "error");
        },
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "সফল",
            text: "ওয়ালেট সফলভাবে আপডেট হয়েছে",
            showConfirmButton: false,
            timer: 1200,
          });
        },
        onSettled: () => {
          setShowEditModal(false);
          setEditData(null);
        },
      }
    );
  };

  const handleDeleteMBank = (id) => {
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
        // Call mutation
        deleteWallet.mutate(id, {
          onSuccess: () => {
            Swal.fire({
              title: "ডিলিট হয়েছে!",
              text: "অপারেটরটি সফলভাবে ডিলিট হয়েছে।",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          },
          onError: (err) => {
            Swal.fire({
              title: "Error!",
              text: err?.response?.data?.message || "ডিলিট ব্যর্থ হয়েছে",
              icon: "error",
            });
          },
        });
      }
    });
  };

  function addNumber() {
    // console.log("num", num);
    if (!num.label || !num.number || !num.channel || !num.type) {
      Swal.fire({
        icon: "error",
        title: "সব তথ্য পূরণ করুন",
        text: "লেবেল, নম্বর, চ্যানেল এবং টাইপ সবগুলো প্রয়োজনীয়।",
      });
      return;
    }

    const newWallet = {
      label: num.label,
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

  // Delete handler
  const handleDeleteTxn = (id) => {
    const prev = [...transactions];

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই লেনদেনটি ডিলিট হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        // Optimistic UI update
        setTransactions((prev) => prev.filter((txn) => txn._id !== id));

        // Call backend
        deleteMutation.mutate(id, {
          onError: () => {
            //  Rollback if error
            setTransactions(prev);
            Swal.fire("ত্রুটি", "লেনদেন ডিলিট ব্যর্থ হয়েছে", "error");
          },
          onSuccess: () => {
            showSuccess("লেনদেন সফলভাবে ডিলিট হয়েছে।");
          },
        });
      }
    });
  };

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
          <CardLoading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {wallets.map((w, i) => (
              <div
                key={i}
                className="relative group p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div className="absolute inset-0 group-hover:bg-black/5 rounded-2xl"></div>
                {/* Edit/Delete Icons */}
                <div
                  className="absolute icon-actions flex top-3 right-3 gap-2
               opacity-0
               transition-all"
                >
                  <button
                    onClick={() => handleEditMBank(w._id)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    <CiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteMBank(w._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
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
        <TableComponent
          data={transactions.filter((row) => row.wallet_id)}
          columns={MobileBankingColumns(handleDeleteTxn)}
          pagination={pagination}
          setPagination={setPagination}
          pageCount={txnData?.pagination?.totalPages ?? -1}
          isFetching={txnFetching}
          isLoading={txnLoading}
        />

        {/*  Edit Wallet Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
              <h2 className="text-xl font-bold mb-4">ওয়ালেট সম্পাদনা করুন</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    লেবেল
                  </label>
                  <input
                    type="text"
                    value={editData.label}
                    onChange={(e) =>
                      setEditData({ ...editData, label: e.target.value })
                    }
                    className="w-full border rounded-lg p-3"
                    placeholder="ব্যাংক"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    নম্বর
                  </label>
                  <input
                    type="number"
                    value={editData.number}
                    onChange={(e) =>
                      setEditData({ ...editData, number: e.target.value })
                    }
                    className="w-full border rounded-lg p-3"
                    placeholder="নম্বর"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    টাইপ
                  </label>
                  <select
                    value={editData.type}
                    onChange={(e) =>
                      setEditData({ ...editData, type: e.target.value })
                    }
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="Agent">এজেন্ট</option>
                    <option value="Personal">পার্সোনাল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ব্যালেন্স
                  </label>
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
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateMBank}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    {editWallet.isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
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
                        placeholder="Bkash Agent"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addNumber(); // submit on enter
                        }}
                      />
                    </Field>

                    <Field label="ফোন নম্বর">
                      <input
                        type="tel"
                        pattern="^01[3-9][0-9]{8}$"
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
                          {["বিকাশ", "নগদ", "রকেট", "উপায়"].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="টাইপ">
                        <select
                          required
                          className="border border-[#6314698e] rounded-xl px-3 py-1.5 bg-white/90 outline-none focus:ring-2 focus:ring-[#862C8A33]"
                          value={num.type}
                          onChange={(e) =>
                            setNum({ ...num, type: e.target.value })
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
                      <option key={w._id} value={w._id}>
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
