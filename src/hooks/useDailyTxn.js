import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDailyTransaction,
  getDailyTransactions,
} from "../api/dailyTxnApi";

export const useCreateDailyTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDailyTransaction,
    onSuccess: () => {
      //  Invalidate if you have a query for transactions
      queryClient.invalidateQueries(["dailyTxn"]);
    },
  });
};

export const useGetTransactions = (page, limit) => {
  return useQuery({
    queryKey: ["dailyTxn", page, limit],
    queryFn: () => getDailyTransactions({ page: page + 1, limit }),
    keepPreviousData: true,
  });
};
