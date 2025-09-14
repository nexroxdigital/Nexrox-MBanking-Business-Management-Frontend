import { motion } from "framer-motion";

const QuickActionButton = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    onClick={onClick}
    className="w-full cursor-pointer bg-card-bg hover:bg-purple-200 dark:bg-gray-800 dark:hover:bg-dark-card-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left group"
  >
    <div className="flex items-center space-x-4">
      <div
        className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  </motion.button>
);

export default QuickActionButton;
