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

// Delete wallet number by ID
export const deleteWalletNumber = async (id) => {
  const res = await axiosSecure.delete(`/wallet/delete/${id}`);
  return res.data;
};

// Update wallet number by ID
export const editWalletNumber = async ({ id, walletData }) => {
  const res = await axiosSecure.put(`/wallet/edit/${id}`, walletData);
  return res.data;
};
