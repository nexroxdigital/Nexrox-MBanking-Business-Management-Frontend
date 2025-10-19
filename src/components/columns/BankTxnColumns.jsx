import { createColumnHelper } from "@tanstack/react-table";
import { MdDeleteOutline, MdEdit } from "react-icons/md";

import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const BankTxnColumns = (onDelete, onEdit) => [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("bank", {
    header: "ব্যাংক",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("method", {
    header: "মেথড",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("branch", {
    header: "শাখা",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("senderName", {
    header: "প্রেরক",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("receiverName", {
    header: "গ্রাহক",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("receiverBank", {
    header: "গ্রাহক ব্যাংক",
    cell: (info) => (
      <span className="whitespace-nowrap min-w-max">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("receiverBankBranch", {
    header: "গ্রাহক শাখা",
    cell: (info) => (
      <span className="whitespace-nowrap block min-w-max">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("amount", {
    header: "পরিমাণ",
    cell: (info) => (
      <span className=" block whitespace-nowrap">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("fee", {
    header: "ফি",
    cell: (info) => (
      <span className=" block text-purple-600 font-medium whitespace-nowrap">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("pay", {
    header: "পে",
    cell: (info) => (
      <span className=" block text-green-600 font-semibold whitespace-nowrap">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),

  columnHelper.display({
    id: "actions",
    header: "অ্যাকশন",
    cell: (info) => (
      <div className="flex items-center gap-3">
        {/* Edit button */}
        <button
          onClick={() => onEdit && onEdit(info.row.original)}
          className="text-blue-600 hover:text-blue-800 transition"
          title="Edit"
        >
          <MdEdit size={18} />
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(info.row.original._id)}
          className="text-red-500 hover:text-red-700 transition whitespace-nowrap text-center"
        >
          <MdDeleteOutline size={20} />
        </button>
      </div>
    ),
  }),
];
