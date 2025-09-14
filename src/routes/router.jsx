import { createBrowserRouter } from "react-router";
import Layouts from "../Layouts";

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
    ],
  },
]);
