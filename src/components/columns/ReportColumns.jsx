import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const ReportColumns = [
  // Date
  columnHelper.accessor("date", {
    header: () => (
      <span className="py-3 px-2 text-gray-100 sticky top-0 z-10  backdrop-blur">
        তারিখ
      </span>
    ),
    cell: ({ getValue }) => (
      <span className="block text-gray-900 px-2">{getValue()}</span>
    ),
  }),

  // Sell
  columnHelper.accessor("totalSale", {
    header: () => (
      <span className="py-3 px-2 text-gray-100  backdrop-blur">বিক্রি</span>
    ),
    cell: ({ getValue }) => (
      <span className="block text-gray-700 px-2">৳{fmtBDT(getValue())}</span>
    ),
  }),

  // Profit
  columnHelper.accessor("totalProfit", {
    header: () => (
      <span className="py-3 px-2 text-gray-100 text-right backdrop-blur">
        লাভ
      </span>
    ),
    cell: ({ getValue }) => (
      <span className="block px-2 text-green-600 font-semibold">
        ৳{fmtBDT(getValue())}
      </span>
    ),
  }),

  // Due
  columnHelper.accessor("totalDue", {
    header: () => (
      <span className="py-3 px-2 text-gray-100 text-right backdrop-blur">
        পাওনা
      </span>
    ),
    cell: ({ getValue }) => (
      <span
        className="inline-block px-2 py-1 rounded-lg font-semibold text-gray-900"
        style={{
          background: "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
        }}
      >
        ৳{fmtBDT(getValue())}
      </span>
    ),
  }),
];
