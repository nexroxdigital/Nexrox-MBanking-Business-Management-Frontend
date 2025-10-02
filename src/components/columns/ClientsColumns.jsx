import { createColumnHelper } from "@tanstack/react-table";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { fmtBDT } from "../../pages/utils";

const columnHelper = createColumnHelper();

export const ClientsColumns = (
  setSelected,
  openPayModal,
  deleteClient,
  openEditModal
) => [
  // Name column
  columnHelper.accessor("name", {
    header: () => (
      <span className="py-3 px-4 text-gray-100 sticky top-0 z-10  backdrop-blur">
        নাম
      </span>
    ),
    cell: ({ row }) => {
      const r = row.original;
      return (
        <button
          className="inline-flex items-center gap-2 font-medium text-gray-900 hover:opacity-90 transition cursor-pointer hover:underline"
          onClick={() => setSelected(r._id)}
          title="ট্রান্সাকশন দেখুন"
        >
          <span
            className="inline-block w-2 h-2 rounded-full opacity-70 group-hover:opacity-100"
            style={{
              background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
            }}
          />
          <span className="truncate">{r.name}</span>
        </button>
      );
    },
  }),

  // Total Sell
  columnHelper.accessor("totalSale", {
    header: () => (
      <span className="py-3 px-4 text-gray-100 text-right backdrop-blur whitespace-nowrap">
        মোট বিক্রি
      </span>
    ),
    cell: ({ getValue }) => (
      <span className="block text-right text-gray-700">
        ৳{fmtBDT(getValue())}
      </span>
    ),
  }),

  // Paid
  columnHelper.accessor("paid", {
    header: () => (
      <span className="py-3 px-4 text-gray-100 text-right   backdrop-blur">
        পেমেন্ট
      </span>
    ),
    cell: ({ getValue }) => (
      <span className="block text-right text-gray-700">
        ৳{fmtBDT(getValue())}
      </span>
    ),
  }),

  // Due
  columnHelper.accessor("due", {
    header: () => (
      <span className="py-3 px-4 text-gray-100 text-right   backdrop-blur">
        পাওনা
      </span>
    ),
    cell: ({ getValue }) => (
      <span
        className="inline-block px-2.5 py-1 rounded-lg font-semibold text-gray-900"
        style={{
          background: "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
        }}
      >
        ৳{fmtBDT(getValue())}
      </span>
    ),
  }),

  // Actions
  columnHelper.display({
    id: "actions",
    header: () => (
      <span className="py-3 px-4 text-gray-100 text-right sticky top-0 z-10   backdrop-blur">
        অ্যাকশন
      </span>
    ),
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex gap-1.5 justify-end">
          <button
            className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-white transition relative whitespace-nowrap"
            onClick={() => openPayModal(r._id)}
            style={{
              borderImageSlice: 1,
              borderImageSource:
                "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            Add Payment
          </button>

          <button
            className=" hover:bg-blue-50 transition relative flex items-center justify-center"
            onClick={() => openEditModal(r._id)}
            title="Edit Client"
          >
            <MdOutlineEdit size={20} />
          </button>

          <button
            className="text-red-600 hover:bg-red-50 transition relative flex items-center justify-center"
            onClick={() => deleteClient(r._id)}
            title="Delete Client"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      );
    },
  }),
];
