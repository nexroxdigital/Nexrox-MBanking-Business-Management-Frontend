import { useInfiniteQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/transactionApi";

export const useTransactions = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["transactions"],
    queryFn: ({ pageParam = 0 }) => getTransactions({ skip: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      // if we got a full page of results, fetch next
      if (lastPage.hasMore) {
        return allPages.flat().length; // next skip = already loaded count
      }
      return undefined; // no more pages
    },
  });
};
