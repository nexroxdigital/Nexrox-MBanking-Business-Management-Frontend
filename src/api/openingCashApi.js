import axiosSecure from "./axiosSecure";

export const fetchTodayOpeningCash = async () => {
  const res = await axiosSecure.get("/opening-cash/today");
  return res.data;
};

// export const updateOpeningCash = async ({ amount }) => {
//   const res = await axiosSecure.post("/opening-cash/set", { amount });
//   return res.data.data;
// };

export const updateOpeningCash = async ({ amount, denominations }) => {
  const response = await axiosSecure.post("/opening-cash/set", {
    amount,
    denominations,
  });
  return response.data.data;
};
