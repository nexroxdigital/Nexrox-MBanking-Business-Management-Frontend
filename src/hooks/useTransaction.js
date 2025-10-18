import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../api/transactionApi";

export const useTransactions = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["transactions"],
    queryFn: ({ pageParam = 0 }) => getTransactions({ skip: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      // if we got a full page of results, fetch next
      if (lastPage.hasMore) {
        return allPages.flat().length; // next skip = already loaded count
      }
      return undefined; // no more pages
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      // Invalidate and refetch transactions queries
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, updateData }) =>
      updateTransaction(transactionId, updateData),
    onSuccess: () => {
      // Invalidate and refetch transactions queries
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
