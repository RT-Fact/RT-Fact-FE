import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addBlacklistDomain,
  addWhitelistDomain,
  removeBlacklistDomain,
  removeWhitelistDomain,
} from "@/api/settingsApi";
import { settingsQueries } from "@/queries/settingsQueries";

export const useAddWhitelistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWhitelistDomain,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settingsQueries.all(),
      });
    },
  });
};

export const useRemoveWhitelistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWhitelistDomain,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settingsQueries.all(),
      });
    },
  });
};

export const useAddBlacklistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBlacklistDomain,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settingsQueries.all(),
      });
    },
  });
};

export const useRemoveBlacklistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBlacklistDomain,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: settingsQueries.all(),
      });
    },
  });
};
