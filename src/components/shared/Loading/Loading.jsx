const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div
        className="
          w-12 h-12 rounded-full animate-spin
          border-4 border-gray-200 dark:border-gray-700
          border-t-purple-600 dark:border-t-emerald-400
        "
      />
    </div>
  );
};

export default Loading;
