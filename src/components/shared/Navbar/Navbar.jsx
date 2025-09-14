import {
  CreditCard,
  FileText,
  Home,
  Lock,
  Menu,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useTheme } from "../../../context/ThemeContext/ThemeContext";
import ThemeToggle from "../../ThemeToggle/ThemeToggle";
import GradientButton from "../Button/GradientButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Clients", icon: Users, href: "/clients" },
    { name: "Transactions", icon: CreditCard, href: "/transactions" },
    { name: "Reports", icon: FileText, href: "/reports" },
    { name: "Company", icon: TrendingUp, href: "/company" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <nav className="bg-[#f5f5f5] sticky z-50 top-0 dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className=" container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img className="h-10 w-28" src="/logosnit.jpg" alt="" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `
      relative flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium
      text-gray-700 hover:text-purple-950 dark:text-gray-300 dark:hover:text-purple-400
      transition-all duration-200
      after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
      after:bg-purple-600 after:transition-all after:duration-300
      ${
        isActive
          ? "after:w-full bg-purple-100 dark:bg-gray-800 text-purple-950 dark:text-purple-400"
          : "after:w-0 hover:after:w-full hover:bg-purple-100 dark:hover:bg-gray-800"
      }
    `
                    }
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            <div className="hidden lg:flex">
              <GradientButton
                label="Login"
                onClick={() => alert("Login clicked!")}
                icon={Lock}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-700 ease-in-out ${
            isMenuOpen
              ? "min-h-96 opacity-100 mb-5"
              : "max-h-0 min-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2 border border-gray-200 dark:border-gray-700">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
                  style={{
                    "--hover-color": theme === "dark" ? "#34D399" : "#862C8A",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color =
                      theme === "dark" ? "#34D399" : "#862C8A";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "";
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Payment Methods Info */}
            <div className="mt-4 px-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Supported Payment Methods
              </p>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                  bKash
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Rocket
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Nagad
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
