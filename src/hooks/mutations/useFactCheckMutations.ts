import { useMutation } from "@tanstack/react-query";

import { patchApplyClaim, patchIgnoreClaim, postFactCheck } from "@/api/factcheckApi";

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
