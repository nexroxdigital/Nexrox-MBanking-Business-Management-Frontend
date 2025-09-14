import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import Footer from "./components/shared/Footer/Footer";
import Loading from "./components/shared/Loading/Loading";
import Navbar from "./components/shared/Navbar/Navbar";

const Layouts = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, [pathname]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {loading ? <Loading /> : <Outlet />}

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Layouts;
