import { motion } from "framer-motion";
import Lottie from "lottie-react";
import registerLottieAnimation from "../../assets/lotties/register.json";

const RegisterLottie = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="hidden lg:flex flex-col items-center justify-center text-center p-8"
    >
      <div className="w-80 h-80 mb-8">
        <Lottie
          animationData={registerLottieAnimation}
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
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Join Our Community
        </h1>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-6">
          ArtifactVault
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
          Start your archaeological journey today. Discover, share, and preserve
          history with fellow enthusiasts worldwide.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RegisterLottie;
