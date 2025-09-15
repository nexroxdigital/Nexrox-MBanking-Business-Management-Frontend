import { Lock, Menu, X } from "lucide-react";

import GradientButton from "../components/shared/Button/GradientButton";

const Navbar = ({ toggleMenu, isMenuOpen }) => {
  return (
    <nav className="bg-[#f5f5f5] sticky z-50 top-0 dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3">
            <img className="h-14 w-32" src="/Ai.png" alt="" />
          </a>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            {/* <ThemeToggle /> */}

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
      </div>
    </nav>
  );
};

export default Navbar;
