import axiosSecure from "./axiosSecure";

// Create a new daily transaction
export const createDailyTransaction = async (txnData) => {
  const res = await axiosSecure.post("/daily-txn/create", txnData);
  return res.data.data;
};

// Get transactions with pagination
export const getDailyTransactions = async ({ page = 1, limit = 10 }) => {
  const res = await axiosSecure.get(`/daily-txn?page=${page}&limit=${limit}`);
  return res.data; // { data, pagination }
};
