import { useState } from "react";
import { useOutletContext } from "react-router";
import BankTransactions from "./pages/Banks";
import Clients from "./pages/Clients";
import ClientTransactions from "./pages/ClientTransactions";
import DailyTransactions from "./pages/DailyTransactions";
import Dashboard from "./pages/Dashbaord";
import MobileBanking from "./pages/MobileBanking";
import MobileRecharge from "./pages/MobileRecharge";
import Tabs from "./pages/Tabs";

export default function App() {
  const [tab, setTab] = useState("dashboard");

  const { isMenuOpen, setIsMenuOpen } = useOutletContext();

  return (
    <>
      <Tabs
        tab={tab}
        setTab={setTab}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      {tab === "dashboard" && <Dashboard />}
      {tab === "transactions" && <ClientTransactions />}
      {tab === "daily-transactions" && <DailyTransactions />}
      {tab === "mobile-bankings" && <MobileBanking />}
      {tab === "mobile-recharge" && <MobileRecharge />}
      {tab === "banks" && <BankTransactions />}
      {tab === "clients" && <Clients />}
      {/* {tab === "reports" && <Reports />} */}
    </>
  );
}
