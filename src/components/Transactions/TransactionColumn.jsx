import { createColumnHelper } from "@tanstack/react-table";
import { MdOutlineDelete } from "react-icons/md";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();
const formatType = (typeString) => {
  if (!typeString) return "";

  const parts = typeString.split(",").map((s) => s.trim());
  if (parts.length <= 2) return parts.join(", ");
  return `${parts.slice(0, 2).join(", ")} ইত্যাদি`;
};

export const transactionColumn = (handleDeleteTxn) => [
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
    header: "আইটেম",
    cell: (info) => formatType(info.getValue()),
  }),
  columnHelper.accessor("number", {
    header: "নাম্বার",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "টাকা",
    cell: (info) => `৳${fmtBDT(info.getValue())}`,
  }),
  columnHelper.accessor("fee", {
    header: "ফি",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("cost", {
    header: "খরচ",
    cell: (info) => `৳${fmtBDT(info.getValue())}`,
  }),
  columnHelper.accessor("commission", {
    header: "কমিশন",
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
