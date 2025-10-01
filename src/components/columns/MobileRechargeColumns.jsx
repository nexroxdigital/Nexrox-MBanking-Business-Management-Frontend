import { createColumnHelper } from "@tanstack/react-table";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const MobileRechargeColumns = [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleDateString('en-GB') : "";
    },
  }),
  columnHelper.accessor("senderNumber", {
    header: "অপারেটর নাম্বার",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("receiverNumber", {
    header: "গ্রাহকের নাম্বার",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("rechargeAmount", {
    header: "রিচার্জ",
    cell: (info) => (
      <span className="block text-green-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("balance", {
    header: "ব্যালেন্স",
    cell: (info) => (
      <span className="block text-blue-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
];
