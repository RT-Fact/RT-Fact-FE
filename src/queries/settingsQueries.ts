import { queryOptions } from "@tanstack/react-query";

import { getSettings } from "@/api/settingsApi";

export const settingsQueries = {
  all: () => ["settings"] as const,

  detail: () =>
    queryOptions({
      queryKey: [...settingsQueries.all(), "detail"],
      queryFn: getSettings,
    }),
};
