import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const MobileBankingColumns = [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("time", {
    header: "সময়",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("sender", {
    header: "প্রেরক",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("receiver", {
    header: "গ্রাহক",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ref", {
    header: "রেফারেন্স",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("trxId", {
    header: "লেনদেন আইডি",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "পরিমাণ",
    cell: (info) => (
      <span className="text-right block">৳{fmtBDT(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("commission", {
    header: "কমিশন",
    cell: (info) => (
      <span className="text-right block text-purple-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("pay", {
    header: "প্রদেয়",
    cell: (info) => (
      <span className="text-right block text-green-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("method", {
    header: "পদ্ধতি",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("balance", {
    header: "ব্যালেন্স",
    cell: (info) => (
      <span className="text-right block text-blue-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
];
