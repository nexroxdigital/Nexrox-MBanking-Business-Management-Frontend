import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import {
  HiEye,
  HiEyeOff,
  HiLockClosed,
  HiMail,
  HiOutlineCollection,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import loginLottie from "../../assets/lotties/login.json";
import Button from "../../components/Button/Button";
import useAuth from "../../context/AuthContext/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");

  const { signInUser, googleSignIn, setLoading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors) {
      setErrors("");
    }
  };

  const handleLogIn = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    signInUser(email, password)
      .then((res) => {
        toast.success("Login successful! Welcome back.");
        navigate(location?.state || "/");
      })
      .catch((err) => {
        setLoading(false);
        console.error(err.message);
        setErrors(err?.message);
      });
  };

  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        toast.success("Login successful! Welcome back.");
        navigate(location?.state || "/");
      })
      .catch((error) => {
        setErrors(error?.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-slate-100 flex items-center justify-center p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <title>Login | ArtifactVault</title>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Animation and Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col items-center justify-center text-center p-8"
        >
          <div className="w-80 h-80 mb-8">
            <Lottie
              animationData={loginLottie}
              loop={true}
              autoplay={true}
              className="w-full h-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-300 mb-4">
              Welcome Back to
            </h1>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-6">
              ArtifactVault
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Continue your journey through history. Discover, catalog, and
              explore the world's most fascinating artifacts.
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-500 p-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="rounded-full p-2 shadow-lg bg-gradient-to-br from-amber-600 to-amber-700">
                  <HiOutlineCollection color="white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">
                  ArtifactVault
                </h1>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-300 mb-2">
                Sign In
              </h2>
              <p className="text-slate-600 dark:text-slate-200">
                Welcome back! Please sign in to your account.
              </p>
            </div>

            {/* General Error */}
            {errors && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleLogIn} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiMail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors dark:focus:ring-amber-700 dark:focus:border-amber-700   transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                 dark:focus:ring-amber-700 dark:focus:border-amber-700   transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <HiEye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Sign In
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full py-3 text-lg font-semibold border-2 border-slate-300 hover:border-slate-400
                  dark:bg-slate-900/80
                hover:bg-slate-50 transition-all duration-300 cursor-pointer"
              >
                <FaGoogle className="mr-3 h-5 w-5 text-red-500" />
                <span className="text-black dark:text-white">
                  Sign in with Google
                </span>
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              By signing in, you agree to our{" "}
              <span className="text-amber-600 hover:text-amber-700">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-amber-600 hover:text-amber-700">
                Privacy Policy
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
