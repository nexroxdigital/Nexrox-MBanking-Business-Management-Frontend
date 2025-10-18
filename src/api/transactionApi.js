import axiosSecure from "./axiosSecure";

//  Get transactions with infinite scroll (skip + limit)
export const getTransactions = async ({ skip, limit }) => {
  const res = await axiosSecure.get("/transactions", {
    params: { skip, limit },
  });
  return res.data;
};

export const deleteTransaction = async (transactionId) => {
  try {
    const response = await axiosSecure.delete(
      `/transactions/delete/${transactionId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTransaction = async (transactionId, updateData) => {
  try {
    const response = await axiosSecure.patch(
      `/transactions/update/${transactionId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
