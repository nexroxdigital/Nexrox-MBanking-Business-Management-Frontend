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
