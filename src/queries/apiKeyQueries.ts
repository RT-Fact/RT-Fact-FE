import { queryOptions } from "@tanstack/react-query";

import { getApiKeys } from "@/api/apiKeyApi";

export const apiKeyQueries = {
  all: () => ["apiKeys"] as const,

  list: () =>
    queryOptions({
      queryKey: [...apiKeyQueries.all(), "list"],
      queryFn: getApiKeys,
    }),
};
