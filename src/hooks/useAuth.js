import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { loginUser } from "../api/authApi";
import axiosSecure from "../api/axiosSecure";
import { useToast } from "./useToast";

export const useLogin = () => {
  const queryClient = useQueryClient();

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
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");

      queryClient.invalidateQueries(["auth"]);
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

export const useAuth = () => {
  // Read from localStorage
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // Parse user if exists
  const user = userData ? JSON.parse(userData) : null;

  // Check if token is still valid
  const isTokenValid = useMemo(() => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      // Compare expiry
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, [token]);

  // Final login state
  const isLoggedIn = !!(token && user && isTokenValid);

  return { isLoggedIn, user, token };
};

// export const useAuth = () => {
//   //React Query will manage and cache the auth state
//   const { data } = useQuery({
//     queryKey: ["auth"],

//     // Function that fetches and validates local auth info
//     queryFn: async () => {
//       const token = localStorage.getItem("token");
//       const userData = localStorage.getItem("user");
//       const user = userData ? JSON.parse(userData) : null;

//       // Validate token
//       let isTokenValid = false;
//       if (token) {
//         try {
//           const decoded = jwtDecode(token);
//           isTokenValid = decoded.exp * 1000 > Date.now();
//         } catch {
//           isTokenValid = false;
//         }
//       }

//       const isLoggedIn = !!(token && user && isTokenValid);
//       return { isLoggedIn, user, token };
//     },

//     // React Query options
//     // staleTime: Infinity, // don't refetch automatically
//     // cacheTime: Infinity, // persist until logout
//   });

//   // Return fallback if query hasn't run yet
//   return data || { isLoggedIn: false, user: null, token: null };
// };

export const useUploadToCloudinary = () => {
  return useMutation({
    mutationFn: async (file) => {
      const CLOUD_NAME = "dhtpxepmr";
      const UPLOAD_PRESET = "mbanking_user";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      return data.secure_url;
    },
  });
};

export const useUpdateUserImage = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();

  return useMutation({
    // Mutation function: send new image URL to backend
    mutationFn: async ({ image }) => {
      const res = await axiosSecure.patch("/auth/update-image", { image });
      return res.data;
    },

    // On success — update localStorage + show success alert
    onSuccess: (data) => {
      showSuccess("Your profile image has been updated successfully.");
      // Update user in localStorage immediately
      const storedUser = localStorage.getItem("user");
      if (storedUser && data?.user?.image) {
        const updatedUser = {
          ...JSON.parse(storedUser),
          image: data.user.image,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Invalidate queries if you cache user data elsewhere
      queryClient.invalidateQueries(["auth"]);
    },

    // On error — show alert
    onError: (error) => {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating your profile image.",
      });
    },
  });
};
