import axiosSecure from "./axiosSecure";

// Create a new client
export const addNewClient = async (clientData) => {
  const res = await axiosSecure.post("/client/add", clientData);
  return res.data;
};

// Get clients with pagination
export const getClients = async ({ page, limit }) => {
  const res = await axiosSecure.get("/client", {
    params: { page, limit },
  });
  return res.data;
};

// Delete a client by ID
export const deleteClient = async (id) => {
  const res = await axiosSecure.delete(`/client/delete/${id}`);
  return res.data;
};

// Update client (only name & phone)
export const updateClient = async ({ id, name, phone }) => {
  const res = await axiosSecure.patch(`/client/update/${id}`, { name, phone });
  return res.data.data;
};

// Adjust client payment (with optional SMS)
export const adjustClientPayment = async ({
  id,
  amount,
  isSendMessage,
  message,
}) => {
  const res = await axiosSecure.patch(`/client/adjust-payment/${id}`, {
    amount,
    isSendMessage,
    message,
  });
  return res.data;
};

export const getTransactionsByClient = async ({ id, skip, limit }) => {
  const res = await axiosSecure.get(`/client/transaction/${id}`, {
    params: { skip, limit },
  });
  return res.data.data;
};
