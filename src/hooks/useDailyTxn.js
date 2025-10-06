import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDailyTransaction,
  getDailyTransactions,
  getLast30DaysReport,
  getMonthlyTransactionReport,
  getTodaysTransactionReport,
  getWalletWiseReport,
} from "../api/dailyTxnApi";

export const useCreateDailyTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDailyTransaction,
    onSuccess: () => {
      //  Invalidate if you have a query for transactions
      queryClient.invalidateQueries(["dailyTxn"]);
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["walletReport"]);
      queryClient.invalidateQueries(["todaysReport"]);
      queryClient.invalidateQueries(["monthlyReport"]);
      queryClient.invalidateQueries(["last30DaysReport"]);
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

export const useWalletWiseReport = () => {
  return useQuery({
    queryKey: ["walletReport"],
    queryFn: getWalletWiseReport,
  });
};

export const useTodaysReport = () => {
  return useQuery({
    queryKey: ["todaysReport"],
    queryFn: getTodaysTransactionReport,
    // staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};

export const useMonthlyReport = () => {
  return useQuery({
    queryKey: ["monthlyReport"],
    queryFn: getMonthlyTransactionReport,
    // staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });
};

export const useLast30DaysReport = () => {
  return useQuery({
    queryKey: ["last30DaysReport"],
    queryFn: getLast30DaysReport,
    // staleTime: 1000 * 60 * 10,
  });
};
