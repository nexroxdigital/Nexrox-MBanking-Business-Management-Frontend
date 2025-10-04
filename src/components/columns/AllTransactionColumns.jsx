import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const AllTransactionColumns = [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleDateString("bn-BD") : "";
    },
  }),
  columnHelper.accessor("channel", {
    header: "চ্যানেল",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "টাইপ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("bill_type", {
    header: "বিল টাইপ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("client_name", {
    header: "ক্লায়েন্ট",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "পরিমাণ",
    cell: (info) => (
      <span className="text-right block">৳{fmtBDT(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("profit", {
    header: "কমিশন",
    cell: (info) => (
      <span className="text-right block text-purple-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("due", {
    header: "বকেয়া",
    cell: (info) => (
      <span className="text-right block text-red-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
];
