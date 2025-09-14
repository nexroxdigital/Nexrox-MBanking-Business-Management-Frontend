import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  Home,
  Mail,
  MessageCircle,
  RefreshCw,
  Server,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";

const ErrorPage = () => {
  const [errorType, setErrorType] = useState("404");
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate floating particles for background effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 10,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const errorTypes = {
    404: {
      title: "Page Not Found",
      description:
        "Oops! The page you're looking for seems to have wandered off into the digital void.",
      icon: <AlertTriangle className="w-16 h-16" />,
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    500: {
      title: "Server Error",
      description:
        "Our servers are having a moment. Don't worry, our team is on it!",
      icon: <Server className="w-16 h-16" />,
      color: "from-red-600 to-orange-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    403: {
      title: "Access Forbidden",
      description:
        "You don't have permission to access this resource. It's like a VIP club, but digital!",
      icon: <Bug className="w-16 h-16" />,
      color: "from-yellow-600 to-red-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    offline: {
      title: "No Internet Connection",
      description:
        "Looks like you've gone offline. Check your connection and try again.",
      icon: <Wifi className="w-16 h-16" />,
      color: "from-blue-600 to-cyan-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
  };

  const currentError = errorTypes[errorType];

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-purple-300/30 rounded-full animate-spin-slow" />
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-lg rotate-45 animate-bounce-slow" />
      <div className="absolute top-1/4 right-1/4 w-12 h-12 border-2 border-blue-300/40 rounded-lg animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Error Type Selector */}
        {/* <div className="mb-8 flex flex-wrap justify-center gap-2">
          {Object.keys(errorTypes).map((type) => (
            <button
              key={type}
              onClick={() => setErrorType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                errorType === type
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
              }`}
            >
              {type === "offline" ? "Offline" : type.toUpperCase()}
            </button>
          ))}
        </div> */}

        {/* Error Icon */}
        <div
          className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${currentError.bgColor} mb-8 transform transition-all duration-500 hover:scale-110`}
        >
          <div
            className={`text-transparent bg-clip-text bg-gradient-to-r ${currentError.color} animate-pulse`}
          >
            {currentError.icon}
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1
            className={`text-8xl md:text-9xl font-black bg-gradient-to-r ${currentError.color} bg-clip-text text-transparent animate-pulse`}
          >
            {errorType === "offline" ? "📡" : errorType}
          </h1>
        </div>

        {/* Error Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
          {currentError.title}
        </h2>

        {/* Error Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          {currentError.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleGoHome}
            className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            <span>Go Home</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isAnimating}
            className="group flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-4 rounded-full font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${
                isAnimating ? "animate-spin" : "group-hover:animate-spin"
              }`}
            />
            <span>{isAnimating ? "Refreshing..." : "Try Again"}</span>
          </button>

          <button
            onClick={handleGoBack}
            className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-2 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Need Help?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@example.com"
              className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
            >
              <Mail className="w-5 h-5 group-hover:animate-bounce" />
              <span>Email Support</span>
            </a>
            <a
              href="#"
              className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
              <span>Live Chat</span>
            </a>
          </div>
        </div>

        {/* Fun Quote */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-500 italic">
          "The best error messages are the ones that help you learn something
          new."
          <br />
          <span className="text-xs">- Every Developer Ever</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-10px) rotate(45deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
