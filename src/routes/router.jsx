import { createBrowserRouter } from "react-router";
import App from "../App";
import ErrorPage from "../components/Error/Error";
import Layouts from "../Layouts";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layouts,
    errorElement: <ErrorPage />,
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
