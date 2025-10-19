import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adjustOperatorBalance,
  createNewRecharge,
  createOperator,
  deleteOperator,
  deleteRechargeTxn,
  editRechargeTxn,
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
      queryClient.invalidateQueries(["transactions"]);
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
      queryClient.invalidateQueries(["transactions"]);
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
      queryClient.invalidateQueries(["transactions"]);
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
      queryClient.invalidateQueries(["transactions"]);
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
      queryClient.invalidateQueries(["transactions"]);
    },
  });
};

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

export const useDeleteRechargeTxn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteRechargeTxn(id),

    onSuccess: () => {
      queryClient.invalidateQueries(["rechargeRecords"]);
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["operators"]);
    },

    onError: (error) => {
      console.error("Error deleting recharge:", error);
    },
  });
};

export const useEditRechargeTxn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => editRechargeTxn(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["rechargeRecords"]);
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["operators"]);
    },
    onError: (err) => {
      console.error("Error updating recharge txn:", err);
    },
  });
};
