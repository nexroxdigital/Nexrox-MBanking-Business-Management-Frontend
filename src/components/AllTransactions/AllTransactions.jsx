import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useToast } from "../../hooks/useToast";
import { useUpdateTransaction } from "../../hooks/useTransaction";
// Helper for Bangla date formatting
const formatBanglaDate = (dateString) => {
  return new Date(dateString).toLocaleString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const AllTransactions = ({
  transactions = [],
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onDeleteTransaction,
}) => {
  const { showSuccess, showError } = useToast();
  const { mutateAsync: editTransaction, isPending: isEditing } =
    useUpdateTransaction();
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleDelete = async (transactionId) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই লেনদেনটি মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await onDeleteTransaction(transactionId);
        showSuccess("লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে");
      } catch (error) {
        showError("লেনদেন মুছে ফেলতে সমস্যা হয়েছে");
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = async (transactionId, updateData) => {
    try {
      await editTransaction({ transactionId, updateData });
      setEditingTransaction(null);
      showSuccess("লেনদেন সফলভাবে আপডেট করা হয়েছে");
    } catch (error) {
      showError("লেনদেন আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setEditingTransaction(null);
    }
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
  };

  return (
    <div
      className="mt-6 max-h-[500px] overflow-y-auto pr-2"
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasNextPage) {
          fetchNextPage();
        }
      }}
    >
      <div className="space-y-3">
        {transactions.slice().map((t, index) => (
          <div
            key={t._id}
            className="group/log flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-100/50 dark:border-gray-700/50 shadow hover:shadow-md"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Left indicator */}
            <div className="flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#009C91] to-[#862C8A] group-hover/log:animate-pulse" />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Date */}
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {formatBanglaDate(t.createdAt)}
              </div>

              {/* Note */}
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium break-words">
                {t.note || "কোনো নোট নেই"}
              </div>
            </div>

            {/* Amount */}
            {/* Amount and Delete Button */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(t)}
                disabled={isEditing}
                className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 opacity-0 group-hover/log:opacity-100"
                title="লেনদেন সম্পাদনা"
              >
                {isEditing ? (
                  <div className="w-4 h-4 border-none border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaEdit size={14} />
                )}
              </button>
              {/* Delete Button - Shows on hover */}
              <button
                onClick={() => handleDelete(t._id)}
                className="opacity-0 group-hover/log:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                title="লেনদেন মুছুন"
              >
                <FaTrash size={14} />
              </button>

              {t.amount && Number(t.amount) > 0 && (
                <span className="inline-block px-3 py-1 text-sm font-bold text-gray-900 dark:text-white rounded-lg bg-gradient-to-r from-[#009C91]/10 to-[#862C8A]/10 border border-gray-200 dark:border-gray-700">
                  ৳{t.amount.toLocaleString("bn-BD")}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#009C91]/20 to-[#862C8A]/20 flex items-center justify-center">
              <span className="text-2xl opacity-60">💳</span>
            </div>
            <div className="text-gray-500 dark:text-gray-400 font-medium">
              কোন লেনদেন নেই
            </div>
          </div>
        )}

        {isFetchingNextPage && (
          <p className="text-center text-gray-500">লোড হচ্ছে...</p>
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
        isSaving={isEditing}
      />
    </div>
  );
};

export default AllTransactions;

// Edit Modal Component
const EditModal = ({ transaction, isOpen, onClose, onSave, isSaving }) => {
  // console.log("note", transaction?.note);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction?.amount || "",
        profit: transaction?.profit || "",
        due: transaction?.due || "",
        note: transaction?.note || "",
      });
    }
  }, [transaction, reset]);

  const onSubmit = (data) => {
    // Filter out empty values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null
      )
    );
    onSave(transaction._id, filteredData);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#99359fe7] to-[#028980ec] p-6 text-white">
          <h2 className="text-xl font-bold">লেনদেন সম্পাদনা</h2>
          <p className="text-white/80 text-sm mt-1">
            প্রয়োজনীয় ফিল্ড আপডেট করুন
          </p>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-h-[60vh] overflow-y-auto"
        >
          {/* Amount */}
          {transaction.amount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                {...register("amount", {
                  min: { value: 0, message: "Amount cannot be negative" },
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#028980] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>
          )}

          {/* Profit */}
          {transaction.profit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profit (৳)
              </label>
              <input
                type="number"
                {...register("profit", {
                  min: { value: 0, message: "Profit cannot be negative" },
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#028980] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Profit"
              />
              {errors.profit && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profit.message}
                </p>
              )}
            </div>
          )}

          {/* Due */}
          {transaction.due && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due (৳)
              </label>
              <input
                type="number"
                {...register("due", {
                  min: { value: 0, message: "Due cannot be negative" },
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#028980] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Due Amount"
              />
              {errors.due && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.due.message}
                </p>
              )}
            </div>
          )}

          {/* Note - Always show as it's common */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              নোট
            </label>
            <textarea
              {...register("note")}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#028980] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="নোট লিখুন..."
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            বাতিল
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#99359fe7] to-[#028980ec] text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                আপডেট হচ্ছে...
              </>
            ) : (
              "আপডেট করুন"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
