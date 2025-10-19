import Swal from "sweetalert2";
import { useEditDailyTxn } from "./useDailyTxn";

export const useEditTransaction = (setTransactions) => {
  const updateMutation = useEditDailyTxn();

  const handleEdit = (id, updatedData) => {
    // Store previous transactions for rollback
    const prevTransactions = setTransactions((prev) => [...prev]);

    // Show confirmation dialog
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই লেনদেনটি আপডেট হবে!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, আপডেট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        // Optimistic UI update - update the transaction in local state immediately
        setTransactions((prev) =>
          prev.map((txn) =>
            txn._id === id
              ? {
                  ...txn,
                  ...updatedData,
                  optimistic: true, // Mark as optimistic update
                }
              : txn
          )
        );

        // Call backend API
        updateMutation.mutate(
          { id, data: updatedData },
          {
            onSuccess: (response) => {
              // Replace optimistic data with server response
              setTransactions((prev) =>
                prev.map((txn) =>
                  txn._id === id
                    ? {
                        ...response.data.dailyTxn,
                        optimistic: false,
                      }
                    : txn
                )
              );

              // Show success message
              Swal.fire({
                icon: "success",
                title: "আপডেট সফল",
                text: "ট্রানজেকশন সফলভাবে আপডেট হয়েছে",
                timer: 2000,
                showConfirmButton: false,
              });
            },
            onError: (err) => {
              console.error(
                "Update txn error:",
                err.response?.data || err.message
              );

              // Rollback to previous state on error
              setTransactions(prevTransactions);

              // Show error message
              Swal.fire({
                icon: "error",
                title: "আপডেট ব্যর্থ",
                text:
                  err.response?.data?.message ||
                  "ট্রানজেকশন আপডেট করতে সমস্যা হয়েছে",
              });
            },
          }
        );
      }
    });
  };

  return {
    handleEdit,
    isUpdating: updateMutation.isPending,
  };
};
