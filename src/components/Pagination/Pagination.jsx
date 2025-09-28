const Pagination = ({ table }) => {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // Generate visible page numbers
  const getPageNumbers = () => {
    if (pageCount <= 5) {
      return [...Array(pageCount).keys()];
    }

    if (currentPage < 3) {
      return [0, 1, 2, "...", pageCount - 2, pageCount - 1];
    }

    if (currentPage >= pageCount - 3) {
      return [0, 1, "...", pageCount - 3, pageCount - 2, pageCount - 1];
    }

    return [
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      pageCount - 2,
      pageCount - 1,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-fit gap-2 flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
      {/* Prev Button */}
      <div className="flex items-center gap-3">
        <select
          className="border rounded p-1 text-sm"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} প্রতি পেইজ
            </option>
          ))}
        </select>

        <button
          className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          পূর্ববর্তী
        </button>
      </div>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((num, i) =>
          num === "..." ? (
            <span key={i} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={i}
              onClick={() => table.setPageIndex(num)}
              className={`px-3 py-1 rounded-md border text-sm ${
                currentPage === num
                  ? "bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white font-bold"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {num + 1}
            </button>
          )
        )}
      </div>

      {/* Next Button + Page Size */}
      <div className="flex items-center gap-3">
        <button
          className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          পরবর্তী
        </button>
      </div>
    </div>
  );
};

export default Pagination;
