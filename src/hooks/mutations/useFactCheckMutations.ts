import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteFactCheck,
  patchApplyClaim,
  patchIgnoreClaim,
  postFactCheck,
} from "@/api/factcheckApi";
import { factcheckQueries } from "@/queries/factcheckQueries";

interface ClaimMutationParams {
  factcheckId: string;
  claimId: string;
}

export const useFactCheckMutation = () => {
  return useMutation({
    mutationFn: postFactCheck,
  });
};

export const useApplyClaimMutation = () => {
  return useMutation({
    mutationFn: ({ factcheckId, claimId }: ClaimMutationParams) =>
      patchApplyClaim(factcheckId, claimId),
  });
};

export const useIgnoreClaimMutation = () => {
  return useMutation({
    mutationFn: ({ factcheckId, claimId }: ClaimMutationParams) =>
      patchIgnoreClaim(factcheckId, claimId),
  });
};

export const useDeleteFactCheckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFactCheck,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: factcheckQueries.all(),
      });
    },
  });
};
