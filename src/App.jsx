import { useState } from "react";
import { useOutletContext } from "react-router";
import BankTransactions from "./pages/Banks";
import Clients from "./pages/Clients";
import ClientTransactions from "./pages/ClientTransactions";
import DailyTransactions from "./pages/DailyTransactions";
import Dashboard from "./pages/Dashbaord";
import MobileBanking from "./pages/MobileBanking";
import MobileRecharge from "./pages/MobileRecharge";
import Reports from "./pages/Reports";
import Tabs from "./pages/Tabs";

/*************************
 * Root App
 *************************/
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
      {tab === "clients" && <Clients />}
      {tab === "reports" && <Reports />}
      {tab === "daily-transactions" && <DailyTransactions />}
      {tab === "mobile-bankings" && <MobileBanking />}
      {tab === "mobile-recharge" && <MobileRecharge />}
      {tab === "banks" && <BankTransactions />}
    </>
  );
}

//  <div className="min-h-screen flex flex-col dark:bg-slate-900 bg-[#f5f5f5]  text-gray-900">
//       <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

//       <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-16 flex-1">
//         <Tabs
//           tab={tab}
//           setTab={setTab}
//           isMenuOpen={isMenuOpen}
//           setIsMenuOpen={setIsMenuOpen}
//         />
//         {tab === "dashboard" && <Dashboard />}
//         {tab === "transactions" && <ClientTransactions />}
//         {tab === "clients" && <Clients />}
//         {tab === "reports" && <Reports />}
//         {tab === "daily-transactions" && <DailyTransactions />}
//         {tab === "mobile-bankings" && <MobileBanking />}
//         {tab === "mobile-recharge" && <MobileRecharge />}
//         {tab === "banks" && <BankTransactions />}
//       </div>

//       <Footer />
//     </div>
