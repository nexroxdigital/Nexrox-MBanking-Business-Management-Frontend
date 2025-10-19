import axiosSecure from "./axiosSecure";

// Create a new bank
export const addNewBank = async (bankData) => {
  const res = await axiosSecure.post("/bank/add", bankData);
  return res.data.data;
};

// Get all banks
export const getBanks = async () => {
  const res = await axiosSecure.get("/bank");
  return res.data.data;
};

export const deleteBank = async (id) => {
  const res = await axiosSecure.delete(`/bank/delete/${id}`);
  return res.data;
};

// Update bank by ID
export const updateBank = async ({ id, bankData }) => {
  const res = await axiosSecure.put(`/bank/update/${id}`, bankData);
  return res.data;
};

export const adjustBankBalance = async ({ id, amount }) => {
  const res = await axiosSecure.patch(`/bank/adjust-balance/${id}`, { amount });
  return res.data;
};

// Create a new bank transaction
export const createBankTransaction = async (txnData) => {
  const res = await axiosSecure.post("/bank/create-transaction", txnData);
  return res.data;
};

// Get all bank transactions with pagination
export const getBankTransactions = async ({ page, limit }) => {
  const res = await axiosSecure.get("/bank/transactions", {
    params: { page, limit },
  });
  return res.data;
};

// delete bank txn

// API Function
export const deleteBankTransaction = async (id) => {
  const response = await axiosSecure.delete(`/bank/delete-transaction/${id}`);

  return response.data;
};

export const editBankTransaction = async (id, data) => {
  try {
    const response = await axiosSecure.put(
      `/bank/edit-transaction/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    // Throw readable error
    throw error.response?.data || { message: "Error updating transaction" };
  }
};
