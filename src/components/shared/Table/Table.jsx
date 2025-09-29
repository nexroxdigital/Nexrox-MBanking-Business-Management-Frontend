import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../../Pagination/Pagination";

const TableComponent = ({ data, columns }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // ✅ enable pagination
    initialState: {
      pagination: {
        pageSize: 5, // default rows per page
      },
    },
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
      <table className="w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gradient-to-r from-[#862C8A] to-[#009C91] text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`p-4 font-semibold border border-gray-200 ${
                    ["amount", "fee", "pay"].includes(header.column.id)
                      ? "text-right"
                      : "text-left"
                  }`}
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`p-4 border border-gray-200 ${
                    ["amount", "fee", "pay"].includes(cell.column.id)
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
