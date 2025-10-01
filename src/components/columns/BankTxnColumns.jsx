import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const BankTxnColumns = [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("time", {
    header: "সময়",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("bank", {
    header: "ব্যাংক",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("branch", {
    header: "শাখা",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("accountName", {
    header: "প্রেরক",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("receiverName", {
    header: "গ্রাহক",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "পরিমাণ",
    cell: (info) => (
      <span className="text-right block">৳{fmtBDT(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("fee", {
    header: "ফি",
    cell: (info) => (
      <span className="text-right block text-purple-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("pay", {
    header: "পে",
    cell: (info) => (
      <span className="text-right block text-green-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
];
