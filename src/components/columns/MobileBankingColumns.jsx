import { createColumnHelper } from "@tanstack/react-table";
import { MdOutlineDelete } from "react-icons/md";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const MobileBankingColumns = (handleDeleteTxn) => [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("wallet_id", {
    header: "প্রেরক",
    cell: (info) => info.getValue()?.label || "—",
  }),
  columnHelper.accessor("client_id", {
    header: "গ্রাহক",
    cell: (info) => {
      const client = info.getValue();
      const row = info.row.original;

      if (client && client.name) {
        return client.name;
      } else if (row.number) {
        return row.number;
      } else {
        return "—";
      }
    },
  }),

  columnHelper.accessor("txn_id", {
    header: "লেনদেন আইডি",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "পরিমাণ",
    cell: (info) => <span className="block">৳{fmtBDT(info.getValue())}</span>,
  }),
  columnHelper.accessor("profit", {
    header: "লাভ",
    cell: (info) => (
      <span className="block text-purple-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("due", {
    header: "বকেয়া",
    cell: (info) => (
      <span className="block text-green-600 font-semibold">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),

  columnHelper.accessor("wallet_balance", {
    header: "ব্যালেন্স",
    cell: (info) => (
      <span className="block text-blue-600 font-semibold">
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
