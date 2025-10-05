import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useAuth";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 max-w-[500px] mx-auto mt-20 w-full">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl w-full max-w-md p-10 m-4 transition-all duration-300 hover:shadow-[#009C91]/30 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
          Admin Login
        </h2>

        {loginMutation.isError && (
          <div className="mb-4 text-sm text-red-500 text-center font-medium">
            {loginMutation.error.response?.data?.message || "Login failed"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white/70 backdrop-blur-sm focus-within:ring-2 focus-within:ring-[#009C91] transition-all">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white/70 backdrop-blur-sm focus-within:ring-2 focus-within:ring-[#862C8A] transition-all">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="focus:outline-none text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 text-white font-semibold rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-95 focus:ring-4 focus:ring-[#009C91]/30"
            style={{
              background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
            }}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
