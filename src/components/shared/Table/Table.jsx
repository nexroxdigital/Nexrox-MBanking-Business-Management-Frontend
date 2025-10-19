import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../../Pagination/Pagination";

const TableComponent = ({
  data,
  columns,
  pagination,
  setPagination,
  pageCount,
  isFetching,
  isLoading,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
      <table className="w-full table-auto text-sm md:text-base border border-gray-200">
        <thead className="bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`p-4 font-semibold border border-gray-200 text-left whitespace-nowrap`}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading
            ? // Show 5 skeleton rows
              [...Array(7)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td key={j} className="p-4 border border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            : table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`p-4 border border-gray-200 text-left`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className="flex justify-between">
        <div></div>
        <Pagination table={table} />
      </div>
    </div>
  );
};

export default TableComponent;
