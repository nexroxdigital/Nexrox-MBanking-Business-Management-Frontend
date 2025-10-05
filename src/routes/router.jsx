import { createBrowserRouter } from "react-router";
import App from "../App";
import Layouts from "../Layouts";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layouts,
    errorElement: <div>404 error page</div>,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <App />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);
