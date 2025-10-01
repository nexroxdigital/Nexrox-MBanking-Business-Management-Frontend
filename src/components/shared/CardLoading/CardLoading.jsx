export const CardLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-[217px] h-[170px] p-4 rounded-xl shadow bg-white animate-pulse relative flex flex-col gap-2"
        >
          <div className="flex justify-between items-start">
            <div className="h-5 w-24 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="h-4 w-28 bg-gray-200 rounded mt-2"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-300 rounded mt-auto"></div>
        </div>
      ))}
    </div>
  );
};
