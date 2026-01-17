import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createApiKey, deleteApiKey } from "@/api/apiKeyApi";
import { apiKeyQueries } from "@/queries/apiKeyQueries";

export const useCreateApiKeyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeyQueries.all() });
    },
  });
};

export const useDeleteApiKeyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeyQueries.all() });
    },
  });
};
