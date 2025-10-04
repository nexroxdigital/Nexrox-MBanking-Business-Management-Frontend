import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MobileRechargeColumns } from "../components/columns/MobileRechargeColumns";
import { CardLoading } from "../components/shared/CardLoading/CardLoading";
import TableComponent from "../components/shared/Table/Table";
import {
  useAdjustOperatorBalance,
  useCreateOperator,
  useCreateRecharge,
  useDeleteOperator,
  useOperators,
  useRechargeRecords,
  useUpdateOperator,
} from "../hooks/useOperator";
import { todayISO } from "./utils";

const MobileRecharge = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustOperatorId, setAdjustOperatorId] = useState("");
  const [adjustValue, setAdjustValue] = useState("");

  const {
    data: rechargeData,
    isLoading: rechargeLoading,
    isFetching: rechargeFetching,
    isError: rechargeError,
  } = useRechargeRecords(pagination.pageIndex, pagination.pageSize);

  const createOperatorMutation = useCreateOperator();
  const adjustOperatorBalanceMutation = useAdjustOperatorBalance();
  const createRechargeMutation = useCreateRecharge();

  // const queryClient = useQueryClient();

  const deleteOperatorMutation = useDeleteOperator();
  const updateOperatorMutation = useUpdateOperator();

  const [operators, setOperators] = useState([]);

  const { data, isLoading, isError } = useOperators();

  useEffect(() => {
    if (data) {
      setOperators(data);
    }
  }, [data]);

  useEffect(() => {
    if (rechargeData?.data) {
      setRechargeRecords(rechargeData.data);
    }
  }, [rechargeData]);

  const [rechargeRecords, setRechargeRecords] = useState([
    {
      date: todayISO(),
      senderNumber: "017XXXXXXXX",
      receiverNumber: "018XXXXXXXX",
      rechargeAmount: 100,
      balance: 900,
    },
    {
      date: todayISO(),
      senderNumber: "017XXXXXXXX",
      receiverNumber: "018XXXXXXXX",
      rechargeAmount: 100,
      balance: 900,
    },
  ]);

  const [showTxnModal, setShowTxnModal] = useState(false);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const rechargeForm = useForm({
    defaultValues: {
      date: todayISO(),
      senderNumber: "",
      receiverNumber: "",
      rechargeAmount: "",
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
    const newRecharge = {
      ...data,
      rechargeAmount: Number(data.rechargeAmount) || 0,
      _id: Date.now().toString(), // temp id for optimistic UI
      optimistic: true,
    };

    // 🟢 Optimistic UI
    setRechargeRecords((prev) => [...prev, newRecharge]);

    createRechargeMutation.mutate(newRecharge, {
      onSuccess: (saved) => {
        // Replace optimistic record with the actual one from backend
        setRechargeRecords((prev) =>
          prev.map((r) => (r._id === newRecharge._id ? saved : r))
        );

        Swal.fire({
          title: "সফল",
          text: "রিচার্জ রেকর্ড যোগ হয়েছে!",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      },
      onError: () => {
        // Rollback UI
        setRechargeRecords((prev) =>
          prev.filter((r) => r._id !== newRecharge._id)
        );
        Swal.fire("ত্রুটি", "রিচার্জ যোগ ব্যর্থ হয়েছে", "error");
      },
      onSettled: () => {
        rechargeForm.reset({
          date: todayISO(),
          senderNumber: "",
          receiverNumber: "",
          rechargeAmount: "",
        });
        setShowTxnModal(false);
      },
    });
  };

  // Edit operator
  const handleEditOperator = (id) => {
    console.log("id", id);

    const operator = operators.find((op) => op._id === id);
    if (!operator) return;

    editForm.reset(operator);
    setEditId(id);
    setShowEditModal(true);
  };

  const handleUpdateOperator = (data) => {
    const updated = { ...data, balance: Number(data.balance) || 0 };

    const prev = [...operators];

    setOperators((prev) =>
      prev.map((op, i) => (i === editId ? { ...op, ...updated } : op))
    );

    updateOperatorMutation.mutate(
      { id: editId, operatorData: updated },
      {
        onError: () => {
          setOperators(prev); // rollback
          Swal.fire("ত্রুটি", "অপারেটর আপডেট ব্যর্থ হয়েছে", "error");
        },
        onSuccess: (saved) => {
          setOperators((prev) =>
            prev.map((op) => (op._id === saved._id ? saved : op))
          );
          Swal.fire({
            title: "সফল",
            text: "অপারেটর আপডেট হয়েছে!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        },
      }
    );

    setShowEditModal(false);
    setEditId(null);
  };

  // Delete operator
  const handleDeleteOperator = (id) => {
    const prev = [...operators];

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
        // 🟢 Optimistic UI update
        setOperators((prev) => prev.filter((op) => op._id !== id));

        // 🔄 Call backend
        deleteOperatorMutation.mutate(id, {
          onError: () => {
            // ❌ Rollback if error
            setOperators(prev);
            Swal.fire("ত্রুটি", "অপারেটর ডিলিট ব্যর্থ হয়েছে", "error");
          },
          onSuccess: () => {
            Swal.fire({
              title: "ডিলিট হয়েছে!",
              text: "অপারেটর সফলভাবে ডিলিট হয়েছে।",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          },
        });
      }
    });
  };

  const handleAddOperator = (data) => {
    const newOperator = {
      ...data,
      balance: Number(data.balance) || 0,
      _id: Date.now().toString(), // temp id
      optimistic: true,
    };

    // 🟢 Optimistic UI
    setOperators((prev) => [...prev, newOperator]);

    createOperatorMutation.mutate(newOperator, {
      onSuccess: (saved) => {
        setOperators((prev) =>
          prev.map((op) => (op._id === newOperator._id ? saved : op))
        );
        Swal.fire({
          title: "সফল",
          text: "অপারেটর যোগ হয়েছে!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      },
      onError: () => {
        setOperators((prev) => prev.filter((op) => op._id !== newOperator._id));
        Swal.fire("ত্রুটি", "অপারেটর যোগ ব্যর্থ হয়েছে", "error");
      },
      onSettled: () => {
        setShowOperatorModal(false);
        operatorForm.reset();
      },
    });
  };

  const handleAdjustBalance = () => {
    const delta = Number(adjustValue || 0);
    if (!adjustOperatorId || isNaN(delta)) return;

    const prev = [...operators];

    // 🟢 Optimistic UI update
    setOperators((prev) =>
      prev.map((op) =>
        op._id === adjustOperatorId
          ? { ...op, balance: (op.balance || 0) + delta }
          : op
      )
    );

    // 🔄 Call backend
    adjustOperatorBalanceMutation.mutate(
      { id: adjustOperatorId, amount: delta },
      {
        onError: () => {
          // ❌ Rollback if error
          setOperators(prev);
          Swal.fire("Error", "Balance adjustment failed", "error");
        },
        onSuccess: () => {
          Swal.fire({
            title: "Success",
            text: "Balance adjusted successfully!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        },
        onSettled: () => {
          // Close modal and reset form
          setShowAdjustModal(false);
          setAdjustOperatorId("");
          setAdjustValue("");
        },
      }
    );
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
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => setShowOperatorModal(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold shadow-lg hover:scale-105 transition hover:bg-gradient-to-l cursor-pointer"
            >
              + নতুন অপারেটর
            </button>
            <button
              onClick={() => setShowTxnModal(true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition hover:bg-gradient-to-l cursor-pointer"
            >
              + নতুন রিচার্জ
            </button>

            <button
              onClick={() => {
                setShowAdjustModal(true);
                setAdjustOperatorId(operators[0]?._id || "");
                setAdjustValue("");
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#009C91] to-[#862C8A] text-white font-semibold shadow-lg hover:scale-105 transition hover:bg-gradient-to-l cursor-pointer"
            >
              + ব্যালেন্স যোগ করুন
            </button>
          </div>
        </div>

        {/* Operators List */}
        {isLoading ? (
          <CardLoading />
        ) : isError ? (
          <p className="text-center text-red-500">
            অপারেটর লোড করতে সমস্যা হয়েছে
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {operators.map((op, i) => (
              <div
                key={op._id || i}
                className="relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#009C91] transition transform flex flex-col items-start group"
              >
                <div className="absolute inset-0 group-hover:bg-black/5 rounded-2xl"></div>
                {/* Edit/Delete Icons */}
                <div className="absolute icon-actions group-hover:flex top-3 right-3 gap-2">
                  <button
                    onClick={() => handleEditOperator(op._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <CiEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteOperator(op._id)}
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
                    ৳{(op.balance ?? 0).toLocaleString("bn-BD")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Operator Modal */}
        {showOperatorModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 h-screen"
            onClick={() => setShowOperatorModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
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
                    className="flex-1 flex justify-center gap-1 items-center py-2 px-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                  >
                    {createOperatorMutation.isPending
                      ? `সংরক্ষণ হচ্ছে...`
                      : "সংরক্ষণ করুন"}
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

        {showAdjustModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 h-screen"
            onClick={() => setShowAdjustModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm animate-fade-in space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                অপারেটর ব্যালেন্স সমন্বয়
              </h2>

              <select
                className="w-full border rounded-lg p-3"
                value={adjustOperatorId}
                onChange={(e) => setAdjustOperatorId(e.target.value)}
              >
                {operators.map((op) => (
                  <option key={op._id} value={op._id}>
                    {op.name} - {op.number}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="৳ পরিমাণ (যেমন: 500 বা -200)"
                className="w-full border rounded-lg p-3"
                value={adjustValue}
                onChange={(e) => setAdjustValue(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2 rounded-lg border"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => handleAdjustBalance()}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold"
                >
                  {adjustOperatorBalanceMutation.isPending
                    ? "যোগ হচ্ছে..."
                    : "যোগ করুন"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Operator Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 h-screen"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
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
          <div
            className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-black/40"
            onClick={() => setShowTxnModal(false)}
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-8 animate-fade-in space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">নতুন রিচার্জ যোগ করুন</h2>
              <form
                onSubmit={rechargeForm.handleSubmit(handleAddRecharge)}
                className="grid grid-cols-1 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    lang="bn-BD"
                    className="w-full border rounded-lg p-3"
                    {...rechargeForm.register("date", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    অপারেটর নাম্বার
                  </label>
                  <select
                    className="w-full border rounded-lg p-3"
                    {...rechargeForm.register("senderNumber", {
                      required: true,
                    })}
                  >
                    <option value="">অপারেটর নাম্বার নির্বাচন করুন</option>
                    {operators.map((op) => (
                      <option key={op._id} value={op.number}>
                        {op.name} - {op.number}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    গ্রাহকের নাম্বার
                  </label>
                  <input
                    type="text"
                    placeholder="গ্রাহকের নাম্বার"
                    className="w-full border rounded-lg p-3"
                    {...rechargeForm.register("receiverNumber", {
                      required: true,
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    রিচার্জ এমাউন্ট
                  </label>
                  <input
                    type="number"
                    placeholder="রিচার্জ এমাউন্ট"
                    className="w-full border rounded-lg p-3"
                    {...rechargeForm.register("rechargeAmount", {
                      required: true,
                    })}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-semibold disabled:opacity-80"
                    disabled={createRechargeMutation.isPending}
                  >
                    {createRechargeMutation.isPending
                      ? "রিচার্জ হচ্ছে..."
                      : "রিচার্জ করুন"}
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
        <TableComponent
          data={rechargeRecords}
          columns={MobileRechargeColumns}
          pagination={pagination}
          setPagination={setPagination}
          pageCount={rechargeData?.pagination?.totalPages ?? -1}
          isFetching={rechargeFetching}
          isLoading={rechargeLoading}
        />
      </div>
    </div>
  );
};

export default MobileRecharge;
