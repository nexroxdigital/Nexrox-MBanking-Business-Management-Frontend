import { createColumnHelper } from "@tanstack/react-table";
import { MdOutlineDelete } from "react-icons/md";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const AllTransactionColumns = (handleDeleteTxn) => [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleDateString("bn-BD") : "";
    },
  }),
  columnHelper.accessor("wallet_id", {
    header: "চ্যানেল",
    cell: (info) => {
      const walletId = info.getValue();
      return walletId ? walletId.label : "—";
    },
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
      <span className="text-left block">৳{fmtBDT(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("profit", {
    header: "কমিশন",
    cell: (info) => (
      <span className="block text-purple-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("due", {
    header: "বকেয়া",
    cell: (info) => (
      <span className="block text-purple-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        onClick={() => handleDeleteTxn(row.original._id)}
        className="text-red-500 hover:text-red-700"
      >
        <MdOutlineDelete size={20} />
      </button>
    ),
  }),
];
