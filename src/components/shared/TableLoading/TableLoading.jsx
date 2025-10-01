const TableLoading = () => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
      <table className="w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white">
          <tr>
            <th className="p-4 font-semibold border border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </th>
            <th className="p-4 font-semibold border border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
            </th>
            <th className="p-4 font-semibold border border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
            </th>
            <th className="p-4 font-semibold border border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(7)].map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="p-4 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="p-4 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </td>
              <td className="p-4 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="p-4 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoading;
