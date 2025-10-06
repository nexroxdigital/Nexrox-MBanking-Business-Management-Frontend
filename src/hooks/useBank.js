import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewBank,
  adjustBankBalance,
  createBankTransaction,
  deleteBank,
  getBanks,
  getBankTransactions,
  updateBank,
} from "../api/bankApi";

// Hook to create a new bank
export const useAddNewBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewBank,
    onSuccess: () => {
      // Refresh bank list
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

// Hook to fetch all banks
export const useBanks = () => {
  return useQuery({
    queryKey: ["banks"],
    queryFn: getBanks,
  });
};

// Hook to delete a bank
export const useDeleteBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBank,
    onSuccess: () => {
      // Refresh bank list after deletion
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

// Hook to update a bank
export const useUpdateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBank,
    onSuccess: () => {
      // Refresh bank list after update
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

// Hook to adjust bank balance
export const useAdjustBankBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustBankBalance,
    onSuccess: () => {
      // Refresh bank list after balance adjustment
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

export const useCreateBankTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBankTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(["banks"]);
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      console.error(
        "Error creating bank transaction:",
        error.response?.data || error.message
      );
    },
  });
};

export const useBankTransactions = (page, limit) => {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: () => getBankTransactions({ page, limit }),
    keepPreviousData: true, //keeps old data while fetching new page
  });
};
