import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewClient,
  deleteClient,
  getClients,
  updateClient,
} from "../api/clientApi";

// Hook to create a new client
export const useAddNewClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewClient,
    onSuccess: () => {
      // Refresh clients list after creation
      queryClient.invalidateQueries(["clients"]);
    },
  });
};

// Hook to fetch clients with pagination
export const useClients = (pageIndex, pageSize) => {
  return useQuery({
    queryKey: ["clients", pageIndex, pageSize], // cache per page
    queryFn: () =>
      getClients({
        page: pageIndex + 1, // backend is 1-based
        limit: pageSize,
      }),
    keepPreviousData: true, // ✅ smooth pagination experience
  });
};

// Hook to delete a client
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      // ✅ Refresh client list after deletion
      queryClient.invalidateQueries(["clients"]);
    },
  });
};

// Hook to update a client's name & phone
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      // ✅ Refresh clients list after update
      queryClient.invalidateQueries(["clients"]);
    },
  });
};
