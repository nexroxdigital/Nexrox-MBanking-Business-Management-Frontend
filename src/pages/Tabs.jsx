import { HiOutlineBanknotes } from "react-icons/hi2";
import { IoIosContacts } from "react-icons/io";
import { LuFileText, LuSlidersHorizontal } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";

function Tabs({ tab, setTab, isMenuOpen, setIsMenuOpen }) {
  const tabs = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: <MdOutlineDashboard /> },
    { id: "transactions", label: "লেনদেন", icon: <HiOutlineBanknotes /> },
    {
      id: "daily-transactions",
      label: "দৈনিক লেনদেন",
      icon: <HiOutlineBanknotes />,
    },
    {
      id: "mobile-bankings",
      label: "মোবাইল ব্যাংকিং",
      icon: <HiOutlineBanknotes />,
    },
    { id: "banks", label: "ব্যাংক", icon: <LuSlidersHorizontal /> },
    { id: "clients", label: "ক্লায়েন্ট", icon: <IoIosContacts /> },
    { id: "reports", label: "রিপোর্ট", icon: <LuFileText /> },
    { id: "settings", label: "সেটিংস", icon: <LuSlidersHorizontal /> },
  ];

  return (
    <>
      <nav className="hidden md:block relative mt-6">
        {/* Background with glassmorphism */}
        <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-2xl p-2  border border-gray-200 dark:border-gray-800/20">
          {/* Floating background orb */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#862C8A]/5 to-[#009C91]/5 animate-pulse" />

          {/* Tab container with better responsive layout */}
          <div className="relative flex flex-wrap gap-1 sm:gap-2">
            {tabs.map((t, index) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`
                group relative flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3 
                rounded-xl text-sm font-semibold transition-all duration-300 
                min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none
                ${
                  tab === t.id
                    ? "text-white shadow-lg transform scale-105 z-10"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-102"
                }
              `}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Active tab gradient background */}
                {tab === t.id && (
                  <>
                    {/* Main gradient */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] opacity-100" />

                    {/* Animated glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] opacity-50 blur-sm animate-pulse" />

                    {/* Subtle inner highlight */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10" />
                  </>
                )}

                {/* Hover effect for inactive tabs */}
                {tab !== t.id && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Content */}
                <span className="relative flex items-center gap-2 z-10">
                  {/* Icon - hidden on very small screens */}
                  <span className="inline text-base">{t.icon}</span>

                  {/* Label */}
                  <span className="font-medium tracking-wide text-base">
                    {t.label}
                  </span>

                  {/* Active indicator dot */}
                  {tab === t.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse ml-1" />
                  )}
                </span>

                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-30 bg-white/20 transition-opacity duration-150" />
              </button>
            ))}
          </div>

          {/* Bottom accent line */}
          {/* <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#862C8A]/20 to-[#009C91]/20 rounded-full" /> */}
        </div>

        {/* Mobile responsive improvements - stack vertically on very small screens */}
        <style>{`
        @media (max-width: 475px) {
          .flex-wrap {
            flex-direction: column;
          }
        }
      `}</style>
      </nav>

      {/* mobile device */}
      <nav
        aria-hidden={!isMenuOpen}
        aria-expanded={isMenuOpen}
        className={`
    fixed inset-x-0 top-20 z-50
    transform-gpu transition-[transform,opacity] duration-300 ease-out
    ${
      isMenuOpen
        ? "translate-y-0 opacity-100"
        : "-translate-y-6 opacity-0 pointer-events-none"
    }
  `}
      >
        <div className="relative mx-3 mt-3 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-2xl p-2 border border-gray-200 dark:border-gray-800/20 shadow-lg">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#862C8A]/5 to-[#009C91]/5 animate-pulse" />
          <div className="relative flex flex-wrap gap-1 sm:gap-2">
            {tabs.map((t, i) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`
              group relative flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3
              rounded-xl text-sm font-semibold transition-all duration-300
              min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-none
              ${
                active
                  ? "text-white shadow-lg scale-[1.02] z-10"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md"
              }
            `}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {active && (
                    <>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91]" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#862C8A] to-[#009C91] opacity-50 blur-sm animate-pulse" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10" />
                    </>
                  )}
                  {!active && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#862C8A]/10 to-[#009C91]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="inline text-base">{t.icon}</span>
                    <span className="font-medium tracking-wide">{t.label}</span>
                    {active && (
                      <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                    )}
                  </span>
                  <div className="absolute inset-0 rounded-xl opacity-0 active:opacity-30 bg-white/20 transition-opacity duration-150" />
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Tabs;
