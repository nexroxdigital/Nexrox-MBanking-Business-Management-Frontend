import axiosSecure from "./axiosSecure.js";

// Create new operator
export const createOperator = async (operatorData) => {
  const res = await axiosSecure.post("/operator/create", operatorData);
  return res.data;
};

// Get all operators
export const getOperators = async () => {
  const res = await axiosSecure.get("/operator");
  return res.data.data;
};

// Delete operator by ID
export const deleteOperator = async (id) => {
  const res = await axiosSecure.delete(`/operator/delete/${id}`);
  return res.data;
};

// Update operator by ID
export const updateOperator = async ({ id, operatorData }) => {
  const res = await axiosSecure.put(`/operator/update/${id}`, operatorData);
  return res.data;
};

// Adjust operator balance (increase or decrease)
export const adjustOperatorBalance = async ({ id, amount }) => {
  const res = await axiosSecure.patch(`/operator/adjust-balance/${id}`, {
    amount,
  });
  return res.data;
};

// Create new recharge history
export const createNewRecharge = async (rechargeData) => {
  const res = await axiosSecure.post("/operator/create-recharge", rechargeData);
  return res.data.data;
};

export const getRechargeRecords = async ({ page, limit }) => {
  const res = await axiosSecure.get("/operator/recharge-records", {
    params: { page, limit },
  });
  return res.data;
};

// delete recharge records
export const deleteRechargeTxn = async (id) => {
  try {
    const res = await axiosSecure.delete(`/operator/delete-recharge/${id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete recharge transaction",
      }
    );
  }
};

// edit and update reacharge txn
export const editRechargeTxn = async (id, data) => {
  const response = await axiosSecure.put(
    `/operator/update-recharge/${id}`,
    data
  );
  return response.data;
};
