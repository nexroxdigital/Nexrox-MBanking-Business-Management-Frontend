import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adjustOperatorBalance,
  createNewRecharge,
  createOperator,
  deleteOperator,
  getOperators,
  getRechargeRecords,
  updateOperator,
} from "../api/operatorApi";

// Hook to create a new operator
export const useCreateOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOperator,
    onSuccess: () => {
      // Refresh operator list after creation (when you add fetch later)
      queryClient.invalidateQueries(["operators"]);
    },
  });
};

// Hook to fetch all operators
export const useOperators = () => {
  return useQuery({
    queryKey: ["operators"],
    queryFn: getOperators,
  });
};

// Hook to delete an operator
export const useDeleteOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOperator,
    onSuccess: () => {
      // Refresh operator list after deletion
      queryClient.invalidateQueries(["operators"]);
    },
  });
};

// Hook to update an operator
export const useUpdateOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOperator,
    onSuccess: () => {
      // Refresh operator list after update
      queryClient.invalidateQueries(["operators"]);
    },
  });
};

// Hook to adjust operator balance
export const useAdjustOperatorBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustOperatorBalance,
    onSuccess: () => {
      // Refresh operator list after balance adjustment
      queryClient.invalidateQueries(["operators"]);
    },
  });
};

// Hook to create recharge history
export const useCreateRecharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewRecharge,
    onSuccess: () => {
      // Refresh recharge histories after creation (when you add fetch later)
      queryClient.invalidateQueries(["rechargeRecords"]);
    },
  });
};

// Hook to fetch all recharge histories
// export const useRechargeRecords = () => {
//   return useQuery({
//     queryKey: ["rechargeRecords"],
//     queryFn: getRechargeRecords,
//   });
// };

export const useRechargeRecords = (pageIndex, pageSize) => {
  return useQuery({
    queryKey: ["rechargeRecords", pageIndex, pageSize],
    queryFn: () =>
      getRechargeRecords({
        page: pageIndex + 1,
        limit: pageSize,
      }),
    keepPreviousData: true,
  });
};
