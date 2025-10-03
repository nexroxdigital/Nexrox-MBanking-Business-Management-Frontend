import axiosSecure from "./axiosSecure";

//  Get transactions with infinite scroll (skip + limit)
export const getTransactions = async ({ skip, limit }) => {
  const res = await axiosSecure.get("/transactions", {
    params: { skip, limit },
  });
  return res.data;
};
