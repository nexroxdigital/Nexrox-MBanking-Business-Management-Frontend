import { useClientTransactions } from "../../hooks/useClient";
import { fmtBDT } from "../../pages/utils";

export default function SingleClientTransaction({ id }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useClientTransactions(id);

  const allTransactions = data?.pages.flat() || [];

  const clientInfo = allTransactions.map(
    (txn) => txn?.client?._id === id && txn
  );

  return (
    <div
      className="h-fit"
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage) {
          fetchNextPage();
        }
      }}
    >
      <ul className="space-y-3 h-full overflow-auto text-sm">
        {clientInfo.length > 0 && (
          <li>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-lg text-gray-900">
                  {clientInfo[0]?.client?.name}
                </div>
                <div className="text-sm text-gray-500">
                  নম্বর: {clientInfo[0]?.client?.phone}
                </div>
                <div className="text-sm text-gray-500">
                  মোট {fmtBDT(clientInfo.length)} ট্রান্সাকশন
                </div>
              </div>
            </div>
          </li>
        )}
        {allTransactions.map((txn) => (
          <>
            <li
              key={txn._id}
              className="rounded-xl border border-gray-100 p-3 hover:shadow-sm transition relative"
            >
              <span
                className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
                style={{
                  background:
                    "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                }}
              />

              <div className="flex items-start justify-between gap-3 pl-2">
                <div className="text-gray-700">
                  <div className="font-medium">
                    {new Date(txn.createdAt).toLocaleString("bn-BD", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {txn?.note && (
                    <div className="text-xs mt-1 text-gray-600">
                      নোট: {txn?.note}
                    </div>
                  )}
                </div>

                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-lg font-semibold text-gray-900 whitespace-nowrap"
                    style={{
                      background:
                        "linear-gradient(270deg, #862C8A1A 0%, #009C911A 100%)",
                    }}
                  >
                    ৳{fmtBDT(txn?.amount)}
                  </span>
                </div>
              </div>
            </li>
          </>
        ))}
        {clientInfo.length === 0 && (
          <li className="text-gray-700 text-center py-5">
            কোন ট্রান্সাকশন নেই
          </li>
        )}
      </ul>

      {isFetchingNextPage && <p className="p-2 text-center">লোড হচ্ছে...</p>}
    </div>
  );
}
