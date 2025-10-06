// Helper for Bangla date formatting
const formatBanglaDate = (dateString) => {
  return new Date(dateString).toLocaleString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const AllTransactions = ({
  transactions = [],
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  return (
    <div
      className="mt-6 max-h-[442px] overflow-y-auto pr-2"
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasNextPage) {
          fetchNextPage();
        }
      }}
    >
      <div className="space-y-3">
        {transactions.slice().map((t, index) => (
          <div
            key={t._id}
            className="group/log flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 border border-gray-100/50 dark:border-gray-700/50 shadow hover:shadow-md"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Left indicator */}
            <div className="flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#009C91] to-[#862C8A] group-hover/log:animate-pulse" />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Date */}
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {formatBanglaDate(t.createdAt)}
              </div>

              {/* Note */}
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium break-words">
                {t.note || "কোনো নোট নেই"}
              </div>
            </div>

            {/* Amount */}
            {t.amount && Number(t.amount) > 0 && (
              <div className="flex-shrink-0 text-right">
                <span className="inline-block px-3 py-1 text-sm font-bold text-gray-900 dark:text-white rounded-lg bg-gradient-to-r from-[#009C91]/10 to-[#862C8A]/10 border border-gray-200 dark:border-gray-700">
                  ৳{t.amount.toLocaleString("bn-BD")}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#009C91]/20 to-[#862C8A]/20 flex items-center justify-center">
              <span className="text-2xl opacity-60">💳</span>
            </div>
            <div className="text-gray-500 dark:text-gray-400 font-medium">
              কোন লেনদেন নেই
            </div>
          </div>
        )}

        {isFetchingNextPage && (
          <p className="text-center text-gray-500">লোড হচ্ছে...</p>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;
