import { keepPreviousData, queryOptions, skipToken } from "@tanstack/react-query";

import type { GetHistoryListParams } from "@/api/factcheckApi";
import { getFactCheckDetail, getHistoryList } from "@/api/factcheckApi";

export const factcheckQueries = {
  all: () => ["factcheck"] as const,

  list: (params: GetHistoryListParams) =>
    queryOptions({
      queryKey: [...factcheckQueries.all(), "list", params],
      queryFn: () => getHistoryList(params),
      placeholderData: keepPreviousData,
    }),

  detail: (id: string | null) =>
    queryOptions({
      queryKey: [...factcheckQueries.all(), "detail", id],
      queryFn: id ? () => getFactCheckDetail(id) : skipToken,
    }),
};
