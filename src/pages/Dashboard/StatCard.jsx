import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  gradient,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6 }}
    className="bg-card-bg hover:bg-purple-200 dark:hover:bg-dark-card-bg dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${gradient}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div
        className={`flex items-center space-x-1 text-sm ${
          changeType === "positive"
            ? "text-green-600 dark:text-green-400"
            : changeType === "negative"
            ? "text-red-600 dark:text-red-400"
            : "text-gray-500"
        }`}
      >
        {changeType === "positive" && <TrendingUp className="w-4 h-4" />}
        {changeType === "negative" && <TrendingDown className="w-4 h-4" />}
        <span>{change}</span>
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  </motion.div>
);

export default StatCard;
