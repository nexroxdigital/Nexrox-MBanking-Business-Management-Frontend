import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const transactionColumn = [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("item", {
    header: "আইটেম",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("method", {
    header: "মেথড",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("pay", {
    header: "টাকা",
    cell: (info) => `৳${fmtBDT(info.getValue())}`,
  }),
  columnHelper.accessor("fee", {
    header: "ফি",
    cell: (info) => `৳${fmtBDT(info.getValue())}`,
  }),
  columnHelper.accessor("cost", {
    header: "খরচ",
    cell: (info) => `৳${fmtBDT(info.getValue())}`,
  }),
  columnHelper.accessor("refund", {
    header: "রিফান্ড",
    cell: (info) => `৳${fmtBDT(info.getValue())}`,
  }),
  columnHelper.accessor("profit", {
    header: "লাভ",
    cell: (info) => (
      <span className="font-semibold text-green-600">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
];
