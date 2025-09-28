import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MobileBankingColumns } from "../components/columns/MobileBankingColumns";
import TableComponent from "../components/shared/Table/Table";
import Settings from "./Settings";
import { todayISO } from "./utils";

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MobileBanking = ({ ctx }) => {
  const [wallets, setWallets] = useState([
    { bank: "বিকাশ", number: "017XXXXXXXX", type: "এজেন্ট", balance: 3500 },
    { bank: "নগদ", number: "018XXXXXXXX", type: "পার্সোনাল", balance: 3500 },
    { bank: "রকেট", number: "019XXXXXXXX", type: "এজেন্ট", balance: 3500 },
  ]);

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

  const [showSetting, setShowSetting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    bank: "",
    number: "",
    type: "",
    balance: "",
  });

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

  return (
    <div className="mt-10">
      <div className="h-1 w-full bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
      <div className="bg-white shadow-2xl rounded-2xl p-6 rounded-tr-none rounded-tl-none space-y-10 border border-gray-100">
        {/* Conditional Rendering */}
        {showSetting ? (
          <Settings ctx={ctx} onClose={() => setShowSetting(false)} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                মোবাইল ব্যাংকিং
              </h1>
              <button
                onClick={() => setShowSetting(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold shadow hover:scale-105 transition"
              >
                নম্বর সেটিং
              </button>
            </div>

            {/* Wallets List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {wallets.map((w, i) => (
                <div
                  key={i}
                  className="relative group p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between"
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
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {w.bank}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        w.type === "এজেন্ট"
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
                      ৳{w.balance.toLocaleString("bn-BD")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Transactions Table */}
            <TableComponent
              data={transactions}
              columns={MobileBankingColumns}
            />
          </>
        )}

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
      </div>
    </div>
  );
};

export default MobileBanking;
