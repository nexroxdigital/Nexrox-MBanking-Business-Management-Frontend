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

// Get wallet-wise report
export const getWalletWiseReport = async () => {
  const res = await axiosSecure.get("/daily-txn/wallet-report");
  return res.data;
};

// Get today's transaction report
export const getTodaysTransactionReport = async () => {
  const res = await axiosSecure.get("/transactions/today-report");
  return res.data; // { totals: { totalSale, totalProfit, totalDue }, ... }
};

//  Get monthly transaction report (last 30 days totals)
export const getMonthlyTransactionReport = async () => {
  const res = await axiosSecure.get("/transactions/monthly-report");
  return res.data;
};

// Get last 30 days report (daily breakdown)
export const getLast30DaysReport = async () => {
  const res = await axiosSecure.get("/transactions/last-30-days");
  return res.data;
};

// delete daily transaction
export const deleteDailyTxnAPI = async (id) => {
  try {
    const response = await axiosSecure.delete(`/daily-txn/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const editDailyTxnAPI = async ({ id, data }) => {
  try {
    const response = await axiosSecure.patch(`/daily-txn/edit/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
