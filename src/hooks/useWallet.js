import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWalletNumber,
  deleteWalletNumber,
  getWalletNumbers,
} from "../api/walletApi";

// Create a new wallet number
export const useCreateWalletNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWalletNumber,

    // 🟢 Optimistic Update
    onMutate: async (newWallet) => {
      await queryClient.cancelQueries(["walletNumbers"]);

      const previousWallets = queryClient.getQueryData(["walletNumbers"]);

      queryClient.setQueryData(["walletNumbers"], (old = []) => [
        ...old,
        { ...newWallet, id: Date.now(), optimistic: true },
      ]);

      return { previousWallets };
    },

    // 🔴 Rollback if error
    onError: (err, newWallet, context) => {
      if (context?.previousWallets) {
        queryClient.setQueryData(["walletNumbers"], context.previousWallets);
      }
    },

    // ✅ Replace optimistic with backend’s data
    onSuccess: (savedWallet) => {
      queryClient.setQueryData(["walletNumbers"], (old = []) =>
        old.map((w) => (w.optimistic ? { ...savedWallet } : w))
      );
    },

    // 🔄 Refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries(["walletNumbers"]);
    },
  });
};

// Hook to fetch wallet numbers
export const useWalletNumbers = () => {
  return useQuery({
    queryKey: ["walletNumbers"],
    queryFn: getWalletNumbers,
  });
};

export const useDeleteWalletNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWalletNumber,
    onSuccess: () => {
      // Refresh wallet numbers after delete
      queryClient.invalidateQueries(["walletNumbers"]);
    },
  });
};
