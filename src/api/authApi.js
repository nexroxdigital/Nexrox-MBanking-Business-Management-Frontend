import axiosSecure from "./axiosSecure";

export const loginUser = async ({ username, password }) => {
  const res = await axiosSecure.post("/auth/login", { username, password });
  return res.data;
};
