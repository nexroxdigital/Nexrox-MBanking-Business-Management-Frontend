import { useEffect, useMemo, useReducer, useState } from "react";
import Clients from "./demoPages/Clients";
import Dashboard from "./demoPages/Dashbaord";
import Navbar from "./demoPages/Navbar";
import Reports from "./demoPages/Reports";
import Settings from "./demoPages/Settings";
import Tabs from "./demoPages/Tabs";
import Transactions from "./demoPages/Transactions";
import { clamp2, COMMISSION_RATES, todayISO, uid } from "./demoPages/utils";

/*************************
 * Reducer & initial state
 *************************/
const initialState = {
  transactions: [],
  clients: [],
  numbers: [],
  sms: { enabled: false, senderId: "", apiKey: "", outbox: [] },
  logs: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "RESET_DEMO":
      return seedDemo();
    case "SAVE":
      saveState(action.payload);
      return action.payload;
    default:
      return state;
  }
}

/*************************
 * Persistence
 *************************/
const STORAGE_KEY = "mbm_mvp_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.log("Failed to save state");
  }
}

/*************************
 * Demo seed data
 *************************/

function seedDemo() {
  const cid1 = uid("client");
  const cid2 = uid("client");
  const n1 = {
    id: uid("num"),
    label: "Bkash Agent 01",
    channel: "Bkash",
    kind: "Agent",
    manualAdj: 0,
  };
  const n2 = {
    id: uid("num"),
    label: "Nagad Personal 019xx",
    channel: "Nagad",
    kind: "Personal",
    manualAdj: 0,
  };
  const t1 = {
    id: uid("tx"),
    date: todayISO(),
    channel: "Bkash",
    type: "Cash In",
    numberType: "Agent",
    numberId: n1.id,
    numberLabel: n1.label,
    clientId: cid1,
    clientName: "Rahim Traders",
    amount: 10000,
    commission: clamp2(10000 * COMMISSION_RATES.Bkash["Cash In"]),
    note: "",
  };
  const t2 = {
    id: uid("tx"),
    date: todayISO(),
    channel: "Nagad",
    type: "Cash Out",
    numberType: "Personal",
    numberId: n2.id,
    numberLabel: n2.label,
    clientId: cid2,
    clientName: "Mita Store",
    amount: 6000,
    commission: 30, // manual because Personal
    note: "",
  };
  const clients = [
    {
      id: cid1,
      name: "Rahim Traders",
      payments: [
        { id: uid("pay"), date: todayISO(), amount: 3000, note: "advance" },
      ],
    },
    { id: cid2, name: "Mita Store", payments: [] },
  ];
  const state = {
    transactions: [t1, t2],
    clients,
    numbers: [n1, n2],
    sms: { enabled: false, senderId: "", apiKey: "", outbox: [] },
    logs: [
      { id: uid("log"), ts: new Date().toISOString(), msg: "Demo data loaded" },
    ],
  };
  saveState(state);
  return state;
}

/*************************
 * Root App
 *************************/
export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [tab, setTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const cached = loadState();
    if (cached) dispatch({ type: "HYDRATE", payload: cached });
    else dispatch({ type: "HYDRATE", payload: seedDemo() });
  }, []);

  const ctx = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <div className="min-h-screen dark:bg-slate-900 bg-[#f5f5f5]  text-gray-900">
      <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-16">
        <Tabs tab={tab} setTab={setTab} isMenuOpen={isMenuOpen} />
        {tab === "dashboard" && <Dashboard ctx={ctx} />}
        {tab === "transactions" && <Transactions ctx={ctx} />}
        {tab === "clients" && <Clients ctx={ctx} />}
        {tab === "reports" && <Reports ctx={ctx} />}
        {tab === "settings" && <Settings ctx={ctx} />}
      </div>
    </div>
  );
}

/*************************
 * Layout components
 *************************/
function TopBar({ onReset }) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">📱 Mobile Banking Manager</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            MVP
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
            title="Load demo data"
          >
            Demo ডাটা
          </button>
        </div>
      </div>
    </header>
  );
}

// function Tabs({ tab, setTab }) {
//   const tabs = [
//     { id: "dashboard", label: "ড্যাশবোর্ড" },
//     { id: "transactions", label: "লেনদেন" },
//     { id: "clients", label: "ক্লায়েন্ট" },
//     { id: "reports", label: "রিপোর্ট" },
//     { id: "settings", label: "সেটিংস" },
//   ];
//   return (
//     <nav className="mt-6 mb-6">
//       <ul className="flex flex-wrap gap-2">
//         {tabs.map((t) => (
//           <li key={t.id}>
//             <button
//               onClick={() => setTab(t.id)}
//               className={`px-4 py-2 rounded-xl text-sm font-medium border ${
//                 tab === t.id
//                   ? "bg-gray-900 text-white"
//                   : "bg-white hover:bg-gray-50"
//               }`}
//             >
//               {t.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }

/*************************
 * Dashboard
 *************************/

<Dashboard />;

/*************************
 * Transactions
 *************************/
<Transactions />;

// function Field({ label, children }) {
//   return (
//     <label className="block">
//       <div className="text-xs text-gray-600 mb-1">{label}</div>
//       {children}
//     </label>
//   );
// }

/*************************
 * Clients
 *************************/
<Clients />;

/*************************
 * Reports
 *************************/
<Reports />;

/*************************
 * Settings (Numbers + SMS)
 *************************/
<Settings />;

/*************************
 * Tailwind base (for preview)
 *************************/
const style = document.createElement("style");
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  html { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; }
`;
document.head.appendChild(style);
