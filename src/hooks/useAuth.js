import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { loginUser } from "../api/authApi";

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Swal.fire({
        title: "Login Successful!",
        text: `Welcome back, ${data.user.username}`,
        icon: "success",
        confirmButtonColor: "#009C91",
        background: "#f8f9fa",
        color: "#333",
        showConfirmButton: true,
        timer: 1200,
        timerProgressBar: true,
      });

      localStorage.setItem("token", data.token);
      navigate("/");
    },
    onError: (error) => {
      Swal.fire({
        title: "Login Failed!",
        text: error.response?.data?.message || "Invalid credentials.",
        icon: "error",
        confirmButtonColor: "#862C8A",
        background: "#f8f9fa",
        color: "#333",
      });
    },
  });
};
