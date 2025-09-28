import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../Pagination/Pagination";
import { transactionColumn } from "./TransactionColumn";

const TransactionTable = ({ data }) => {
  const table = useReactTable({
    data,
    columns: transactionColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 text-left font-semibold border border-gray-200"
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
                <td key={cell.id} className="p-3 border border-gray-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between">
        <div></div>
        <Pagination table={table} />
      </div>
      {/* <MuiTablePagination table={table} /> */}
    </div>
  );
};

export default TransactionTable;
