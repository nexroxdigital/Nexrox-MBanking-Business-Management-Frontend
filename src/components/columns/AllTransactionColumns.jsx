import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const AllTransactionColumns = [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("channel", {
    header: "চ্যানেল",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "টাইপ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("numberType", {
    header: "নাম্বার টাইপ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("numberLabel", {
    header: "নাম্বার",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("billType", {
    header: "বিল টাইপ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("clientName", {
    header: "ক্লায়েন্ট",
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
  columnHelper.accessor("dueAmount", {
    header: "বকেয়া",
    cell: (info) => (
      <span className="text-right block text-red-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("note", {
    header: "নোট",
    cell: (info) => info.getValue(),
  }),
];
