import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import type { GetHistoryListParams } from "@/api/factcheckApi";
import { getHistoryList } from "@/api/factcheckApi";

export const factcheckQueries = {
  all: () => ["factcheck"] as const,

  list: (params: GetHistoryListParams) =>
    queryOptions({
      queryKey: [...factcheckQueries.all(), "list", params],
      queryFn: () => getHistoryList(params),
      placeholderData: keepPreviousData,
    }),
};
