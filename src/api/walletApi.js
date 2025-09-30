import axiosSecure from "./axiosSecure";

// Create new wallet number
export const createWalletNumber = async (walletData) => {
  const res = await axiosSecure.post("/wallet/create", walletData);
  return res.data;
};

// Get all wallet numbers
export const getWalletNumbers = async () => {
  const res = await axiosSecure.get("/wallet");
  return res.data.data;
};
