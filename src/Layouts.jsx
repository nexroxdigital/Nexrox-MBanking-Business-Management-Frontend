import { useState } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Footer from "./components/shared/Footer/Footer";
import Navbar from "./pages/Navbar";

const Layouts = () => {
  // const [loading, setLoading] = useState(true);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900 bg-[#f5f5f5]  text-gray-900">
      {/* Navbar */}
      <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-16 flex-1">
        <Outlet context={{ isMenuOpen, setIsMenuOpen }} />
      </div>

      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={2100}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Layouts;
