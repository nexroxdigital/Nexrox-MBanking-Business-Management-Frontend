import { useMutation } from "@tanstack/react-query";
import { createWalletNumber } from "../api/walletApi";
// import { createWalletNumber, getWalletNumbers } from "../api/walletApi";

// Fetch all wallet numbers
// export const useWalletNumbers = () => {
//   return useQuery({
//     queryKey: ["walletNumbers"],
//     queryFn: getWalletNumbers,
//   });
// };

// Create a new wallet number
export const useCreateWalletNumber = () => {
  //   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWalletNumber,
    onSuccess: () => {
      //   queryClient.invalidateQueries(["walletNumbers"]); // refetch list
    },
  });
};
