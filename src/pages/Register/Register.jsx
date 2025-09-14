import { motion } from "framer-motion";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import {
  HiLockClosed,
  HiMail,
  HiOutlineCollection,
  HiPhotograph,
  HiUser,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../../components/Button/Button";
import useAuth from "../../context/AuthContext/AuthContext";
import { validateForm } from "../../utils/Validation";
import InputForm from "./InputForm";
import RegisterLottie from "./RegisterLottie";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
    terms: false,
    general: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const { createUser, setUser, updateUser, googleSignIn } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "terms" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, photoURL } = formData;

    const isValid = validateForm(formData, setErrors);

    if (!isValid) return;

    // create new user
    createUser(email, password).then((res) => {
      const user = res.user;
      updateUser({ displayName: name, photoURL: photoURL })
        .then(() => {
          setUser({ ...user, displayName: name, photoURL: photoURL });
          navigate(location?.state || "/");
          toast.success("Your account has been created");
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const handleGoogleRegister = () => {
    googleSignIn()
      .then((res) => {
        navigate(location?.state || "/");
        toast.success("Your account has been created");
      })
      .then((err) => {
        setErrors((prev) => ({
          ...prev,
          general: err?.message,
        }));
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-black flex items-center justify-center p-4">
      <title>Register | ArtifactVault</title>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Animation and Branding */}
        <RegisterLottie />

        {/* Right Side - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="rounded-full p-2 shadow-lg bg-gradient-to-br from-amber-600 to-amber-700">
                  <HiOutlineCollection color="white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  ArtifactVault
                </h1>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Create Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Join us and start exploring history!
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.general}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Field */}
              <InputForm
                label="Name"
                inputName="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                error={errors.name}
              >
                <HiUser className="h-5 w-5 text-slate-400 dark:text-slate-400" />
              </InputForm>

              {/* Email Field */}
              <InputForm
                label="Email"
                inputName="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                error={errors.email}
              >
                <HiMail className="h-5 w-5 text-slate-400 dark:text-slate-400" />
              </InputForm>

              {/* Photo URL Field */}
              <InputForm
                label="Photo URL"
                inputName="photoURL"
                type="url"
                value={formData.photoURL}
                onChange={handleInputChange}
                placeholder="Enter your photo URL"
                error={errors.photoURL}
              >
                <HiPhotograph className="h-5 w-5 text-slate-400 dark:text-slate-400" />
              </InputForm>

              {/* Password Field */}
              <InputForm
                label="Password"
                inputName="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                error={errors.password}
                showPassword={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <HiLockClosed className="h-5 w-5 text-slate-400 dark:text-slate-400" />
              </InputForm>

              {/* Confirm Password Field */}
              <InputForm
                label="Confirm Password"
                inputName="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                showConfirmPassword={showConfirmPassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <HiLockClosed className="h-5 w-5 text-slate-400 dark:text-slate-400" />
              </InputForm>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded mt-1"
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                >
                  I agree to the{" "}
                  <span className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-medium">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-medium">
                    Privacy Policy
                  </span>
                </label>
              </div>
              <div className="text-red-600  dark:text-red-300 text-sm">
                {errors.terms && errors.terms}
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Register Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleRegister}
                className="w-full py-3 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 text-slate-700 dark:text-slate-100"
              >
                <FaGoogle className="mr-3 h-5 w-5 text-red-500" />
                Sign up with Google
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
