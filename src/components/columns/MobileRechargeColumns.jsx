import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const MobileRechargeColumns = [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("senderNo", {
    header: "প্রেরকের নাম্বার",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("receiverNo", {
    header: "গ্রাহকের নাম্বার",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("pay", {
    header: "প্রদেয়",
    cell: (info) => (
      <span className="text-right block text-green-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("balance", {
    header: "ব্যালেন্স",
    cell: (info) => (
      <span className="text-right block text-blue-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
];
