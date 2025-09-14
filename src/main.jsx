import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./routes/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ThemeProvider> */}
    {/* <AuthProvider> */}
    <RouterProvider router={router} />
    {/* </AuthProvider> */}
    {/* </ThemeProvider> */}
  </StrictMode>
);
