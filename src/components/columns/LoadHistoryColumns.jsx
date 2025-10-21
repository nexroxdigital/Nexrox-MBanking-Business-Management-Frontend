import { createColumnHelper } from "@tanstack/react-table";
import { MdOutlineDelete } from "react-icons/md";
import { fmtBDT } from "../../pages/utils";
import { CiEdit } from "react-icons/ci";

const columnHelper = createColumnHelper();

export const LoadHistoryColumns = (handleDelete, handleEdit) => [
  columnHelper.accessor("date", {
    header: "তারিখ",
    cell: (info) => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleDateString("en-GB") : "";
    },
  }),
  columnHelper.accessor("operator.name", {
    header: "অপারেটর নাম",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("operator.number", {
    header: "অপারেটর নাম্বার",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "লোড পরিমাণ",
    cell: (info) => (
      <span
        className={`block font-semibold ${
          info.getValue() >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("newBalance", {
    header: "নতুন ব্যালেন্স",
    cell: (info) => (
      <span className="block text-blue-600 font-medium">
        ৳{fmtBDT(info.getValue())}
      </span>
    ),
  }),
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(row.original)}
          className="text-blue-500"
        >
          <CiEdit size={20} />
        </button>
        <button
          onClick={() => handleDelete(row.original._id)}
          className="text-red-500 hover:text-red-700"
        >
          <MdOutlineDelete size={20} />
        </button>
      </div>
    ),
  },
];
