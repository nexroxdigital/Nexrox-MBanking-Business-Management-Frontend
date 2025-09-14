import { createBrowserRouter } from "react-router";
import ErrorPage from "../components/Error/Error";
import Layouts from "../Layouts";
import ClientPage from "../pages/ClientPage/ClientPage";
import CompanyManagement from "../pages/CompanyManagement/CompanyManagement";
import Dashboard from "../pages/Dashboard/Dashboard";
import Reports from "../pages/Reports/Reports";
import Reports222 from "../pages/Reports222/Reports";
import SettingsPage from "../pages/Settings/Settings";
import Transactions from "../pages/Transactions/Transactions";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layouts,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/clients",
        element: <ClientPage />,
      },
      {
        path: "/company",
        element: <CompanyManagement />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/reports222",
        element: <Reports222 />,
      },

      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
