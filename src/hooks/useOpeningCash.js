import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  fetchTodayOpeningCash,
  updateOpeningCash,
} from "../api/openingCashApi";
import { useToast } from "./useToast";

export const useOpeningCash = () => {
  const { showSuccess } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["openingCash"],
    queryFn: fetchTodayOpeningCash,
  });

  const mutation = useMutation({
    mutationFn: updateOpeningCash,

    //  Optimistic update
    onMutate: async (newCash) => {
      await queryClient.cancelQueries(["openingCash"]);

      const previousData = queryClient.getQueryData(["openingCash"]);

      // Optimistically update cache
      queryClient.setQueryData(["openingCash"], (old) => ({
        ...old,
        amount: newCash.amount,
      }));

      return { previousData };
    },

    // On success: confirm visually
    onSuccess: () => {
      showSuccess("ক্যাশ সফলভাবে হালনাগাদ করা হয়েছে");

      queryClient.invalidateQueries(["openingCash"]);
      queryClient.invalidateQueries(["transactions"]);
    },

    // On error: rollback + show alert
    onError: (error, _, context) => {
      queryClient.setQueryData(["openingCash"], context.previousData);

      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: error.response?.data?.message || "Something went wrong.",
        confirmButtonColor: "#862C8A",
      });
    },
  });

  return { data, isLoading, mutation };
};
