import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useAuth from "../context/AuthContext/AuthContext";

const axiosInstance = axios.create({
  baseURL: "https://server-alpha-livid.vercel.app",
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (user) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      }
    );

    // response interceptor to handle errors
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.status === 401 || error.status === 403) {
          signOutUser()
            .then(() => {
              toast.error(
                "You have been logged out due to unauthorized access. Please login again."
              );
            })
            .catch((err) => {
              console.error(err);
            });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, signOutUser]);

  return axiosInstance;
};

export default useAxiosSecure;
