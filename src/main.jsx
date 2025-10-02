import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ThemeProvider> */}
    {/* <AuthProvider> */}
    {/* <RouterProvider router={router} /> */}
    {/* </AuthProvider> */}
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={2100}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </QueryClientProvider>
    {/* </ThemeProvider> */}
  </StrictMode>
);
