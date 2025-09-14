import { createBrowserRouter } from "react-router";
import Layouts from "../Layouts";
import Dashboard from "../pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layouts,
    errorElement: <h1>this is error page</h1>,
    children: [
      {
        index: true,
        element: <h1>this is home page</h1>,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
