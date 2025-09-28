import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MobileRechargeColumns } from "../components/columns/MobileRechargeColumns";
import TableComponent from "../components/shared/Table/Table";
import { todayISO } from "./utils";

const MobileRecharge = () => {
  const [operators, setOperators] = useState([
    { name: "রবি", number: "016XXXXXXXX", balance: 2200 },
    { name: "গ্রামীণফোন", number: "017XXXXXXXX", balance: 2300 },
    { name: "বাংলালিংক", number: "019XXXXXXXX", balance: 3200 },
  ]);

  const [transactions, setTransactions] = useState([
    {
      date: todayISO(),
      senderNo: "017XXXXXXXX",
      receiverNo: "018XXXXXXXX",
      pay: 100,
      balance: 900,
    },
    {
      date: todayISO(),
      senderNo: "017XXXXXXXX",
      receiverNo: "018XXXXXXXX",
      pay: 100,
      balance: 900,
    },
  ]);

  const [showTxnModal, setShowTxnModal] = useState(false);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const rechargeForm = useForm({
    defaultValues: {
      date: todayISO(),
      senderNo: "",
      receiverNo: "",
      pay: "",
      balance: "",
    },
  });

  const operatorForm = useForm({
    defaultValues: { name: "", number: "", balance: "" },
  });

  const editForm = useForm({
    defaultValues: { name: "", number: "", balance: "" },
  });

  // Add new recharge
  const handleAddRecharge = (data) => {
    setTransactions([...transactions, data]);
    rechargeForm.reset({
      date: todayISO(),
      senderNo: "",
      receiverNo: "",
      pay: "",
      balance: "",
    });
    setShowTxnModal(false);
  };

  // Add new operator
  const handleAddOperator = (data) => {
    setOperators([
      ...operators,
      { ...data, balance: Number(data.balance) || 0 },
    ]);
    operatorForm.reset();
    setShowOperatorModal(false);
  };

  // Edit operator
  const handleEditOperator = (index) => {
    setEditIndex(index);
    editForm.reset(operators[index]);
    setShowEditModal(true);
  };

  const handleUpdateOperator = (data) => {
    const updated = [...operators];
    updated[editIndex] = { ...data, balance: Number(data.balance) || 0 };
    setOperators(updated);
    setShowEditModal(false);
    setEditIndex(null);
  };

  // Delete operator
  const handleDeleteOperator = (index) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই অপারেটরটি ডিলিট হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        setOperators(operators.filter((_, i) => i !== index));
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
          <h1 className="text-lg md:text-3xl font-extrabold text-gray-900 tracking-tight">
            মোবাইল রিচার্জ হিস্টোরি
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowOperatorModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              + নতুন অপারেটর
            </button>
            <button
              onClick={() => setShowTxnModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              + নতুন রিচার্জ
            </button>
          </div>
        </div>

        {/* Operators List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {operators.map((op, i) => (
            <div
              key={i}
              className="relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#009C91] transition transform flex flex-col items-start"
            >
              {/* Edit/Delete Icons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => handleEditOperator(i)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <CiEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteOperator(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <MdOutlineDelete size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900">{op.name}</h3>
              <p className="mt-3 text-gray-700 text-lg font-mono tracking-wide">
                {op.number}
              </p>
              <div className="mt-3">
                <span className="text-sm text-gray-500">ব্যালেন্স</span>
                <p className="text-2xl font-bold text-green-600">
                  ৳{op.balance.toLocaleString("bn-BD")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Operator Modal */}
        {showOperatorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">নতুন অপারেটর যোগ করুন</h2>
              <form
                onSubmit={operatorForm.handleSubmit(handleAddOperator)}
                className="grid grid-cols-1 gap-4"
              >
                <input
                  type="text"
                  placeholder="অপারেটরের নাম (রবি, গ্রামীণফোন ইত্যাদি)"
                  className="w-full border rounded-lg p-3"
                  {...operatorForm.register("name", { required: true })}
                />
                <input
                  type="text"
                  placeholder="নম্বর"
                  className="w-full border rounded-lg p-3"
                  {...operatorForm.register("number", { required: true })}
                />
                <input
                  type="number"
                  placeholder="ব্যালেন্স"
                  className="w-full border rounded-lg p-3"
                  {...operatorForm.register("balance", { required: true })}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOperatorModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Operator Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">অপারেটর সম্পাদনা করুন</h2>
              <form
                onSubmit={editForm.handleSubmit(handleUpdateOperator)}
                className="grid grid-cols-1 gap-4"
              >
                <input
                  type="text"
                  placeholder="অপারেটরের নাম"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("name", { required: true })}
                />
                <input
                  type="text"
                  placeholder="নম্বর"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("number", { required: true })}
                />
                <input
                  type="number"
                  placeholder="ব্যালেন্স"
                  className="w-full border rounded-lg p-3"
                  {...editForm.register("balance", { required: true })}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    আপডেট করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Recharge Modal */}
        {showTxnModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg animate-fade-in space-y-6">
              <h2 className="text-xl font-bold mb-4">নতুন রিচার্জ যোগ করুন</h2>
              <form
                onSubmit={rechargeForm.handleSubmit(handleAddRecharge)}
                className="grid grid-cols-1 gap-4"
              >
                <input
                  type="date"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("date", { required: true })}
                />
                <select
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("senderNo", { required: true })}
                >
                  <option value="">অপারেটর নাম্বার নির্বাচন করুন</option>
                  {operators.map((op, i) => (
                    <option key={i} value={op.number}>
                      {op.name} - {op.number}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="রিসিভার নাম্বার"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("receiverNo", { required: true })}
                />
                <input
                  type="number"
                  placeholder="পে"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("pay", { required: true })}
                />
                <input
                  type="number"
                  placeholder="ব্যালেন্স"
                  className="w-full border rounded-lg p-3"
                  {...rechargeForm.register("balance", { required: true })}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTxnModal(false)}
                    className="flex-1 py-2 rounded-lg border"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <TableComponent data={transactions} columns={MobileRechargeColumns} />
      </div>
    </div>
  );
};

export default MobileRecharge;
