import { createBrowserRouter } from "react-router";
import Layouts from "../Layouts";
import CustomerManagement from "../pages/ClientManagement/Clie";
import ClientManagement from "../pages/ClientManagement/ClientManagement";
import CompanyManagement from "../pages/CompanyManagement/CompanyManagement";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardTwo from "../pages/DashboardTwo/DashbaordTwo";
import Transactions from "../pages/Transactions/Transactions";

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
      {
        path: "/dashboard2",
        element: <DashboardTwo />,
      },
      {
        path: "/clients",
        element: <ClientManagement />,
      },
      {
        path: "/cli",
        element: <CustomerManagement />,
      },
      {
        path: "/company",
        element: <CompanyManagement />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
    ],
  },
]);
