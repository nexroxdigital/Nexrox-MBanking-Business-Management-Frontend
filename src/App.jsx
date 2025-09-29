import { useState } from "react";
import Footer from "./components/shared/Footer/Footer";
import BankTransactions from "./pages/Banks";
import Clients from "./pages/Clients";
import ClientTransactions from "./pages/ClientTransactions";
import DailyTransactions from "./pages/DailyTransactions";
import Dashboard from "./pages/Dashbaord";
import MobileBanking from "./pages/MobileBanking";
import MobileRecharge from "./pages/MobileRecharge";
import Navbar from "./pages/Navbar";
import Reports from "./pages/Reports";
import Tabs from "./pages/Tabs";

/*************************
 * Reducer & initial state
 *************************/
// const initialState = {
//   openingCash: 0,
//   transactions: [],
//   clients: [],
//   numbers: [],
//   sms: { enabled: false, senderId: "", apiKey: "", outbox: [] },
//   logs: [],
// };

// function appReducer(state, action) {
//   switch (action.type) {
//     case "HYDRATE":
//       return action.payload;
//     case "RESET_DEMO":
//       return seedDemo();
//     case "SAVE":
//       saveState(action.payload);
//       return action.payload;
//     default:
//       return state;
//   }
// }

/*************************
 * Persistence
 *************************/
// const STORAGE_KEY = "mbm_mvp_state_v1";

// function loadState() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return null;
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// }

// function saveState(state) {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//   } catch {
//     console.log("Failed to save state");
//   }
// }

/*************************
 * Demo seed data
 *************************/

// function seedDemo() {
//   const cid1 = uid("client");
//   const cid2 = uid("client");
//   const n1 = {
//     id: uid("num"),
//     label: "Bkash Agent 01",
//     channel: "Bkash",
//     kind: "Agent",
//     manualAdj: 0,
//   };
//   const n2 = {
//     id: uid("num"),
//     label: "Nagad Personal 019xx",
//     channel: "Nagad",
//     kind: "Personal",
//     manualAdj: 0,
//   };
//   const t1 = {
//     id: uid("tx"),
//     date: todayISO(),
//     channel: "Bkash",
//     type: "Cash In",
//     numberType: "Agent",
//     numberId: n1.id,
//     numberLabel: n1.label,
//     clientId: cid1,
//     clientName: "Rahim Traders",
//     amount: 10000,
//     commission: clamp2(10000 * COMMISSION_RATES.Bkash["Cash In"]),
//     note: "",
//   };
//   const t2 = {
//     id: uid("tx"),
//     date: todayISO(),
//     channel: "Nagad",
//     type: "Cash Out",
//     numberType: "Personal",
//     numberId: n2.id,
//     numberLabel: n2.label,
//     clientId: cid2,
//     clientName: "Mita Store",
//     amount: 6000,
//     commission: 30, // manual because Personal
//     note: "",
//   };
//   const clients = [
//     {
//       id: cid1,
//       name: "Rahim Traders",
//       number: "00928373232",
//       payments: [
//         { id: uid("pay"), date: todayISO(), amount: 3000, note: "advance" },
//       ],
//     },
//     { id: cid2, name: "Mita Store", number: "01928373232", payments: [] },
//   ];
//   const state = {
//     transactions: [t1, t2],
//     clients,
//     numbers: [n1, n2],
//     sms: { enabled: false, senderId: "", apiKey: "", outbox: [] },
//     logs: [
//       { id: uid("log"), ts: new Date().toISOString(), msg: "Demo data loaded" },
//     ],
//   };
//   saveState(state);
//   return state;
// }

/*************************
 * Root App
 *************************/
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900 bg-[#f5f5f5]  text-gray-900">
      <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-16 flex-1">
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
      </div>

      <Footer />
    </div>
  );
}
