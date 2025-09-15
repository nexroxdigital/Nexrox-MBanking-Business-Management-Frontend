import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./context/ThemeContext/ThemeContext.jsx";
import "./index.css";
import { router } from "./routes/router.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ThemeProvider> */}
      {/* <AuthProvider> */}
      {/* <RouterProvider router={router} /> */}
      {/* </AuthProvider> */}

    <App />
    {/* </ThemeProvider> */}

  </StrictMode>
);
