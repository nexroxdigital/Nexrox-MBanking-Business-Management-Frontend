// src/hooks/useToast.js
import { toast } from "react-toastify";

export const useToast = () => {
  const showSuccess = (msg) => toast.success(msg);
  const showError = (msg) => toast.error(msg);
  const showInfo = (msg) => toast.info(msg);

  return { showSuccess, showError, showInfo };
};
