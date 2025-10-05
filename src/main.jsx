import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./routes/router.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <App /> */}
    </QueryClientProvider>
  </StrictMode>
);

//  <ToastContainer
//         position="top-center"
//         autoClose={2100}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />
