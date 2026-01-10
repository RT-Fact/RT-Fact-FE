import type { ApplyClaimResponse, FactCheckResponse, IgnoreClaimResponse } from "@/types/factcheck";

import { apiClient } from "./client";

export const postFactCheck = async (text: string): Promise<FactCheckResponse> => {
  const { data } = await apiClient.post<FactCheckResponse>("/factcheck", { text });
  return data;
};

export const patchApplyClaim = async (
  factcheckId: string,
  claimId: string,
): Promise<ApplyClaimResponse> => {
  const { data } = await apiClient.patch<ApplyClaimResponse>(
    `/factcheck/${factcheckId}/claims/${claimId}/apply`,
  );
  return data;
};

export const patchIgnoreClaim = async (
  factcheckId: string,
  claimId: string,
): Promise<IgnoreClaimResponse> => {
  const { data } = await apiClient.patch<IgnoreClaimResponse>(
    `/factcheck/${factcheckId}/claims/${claimId}/ignore`,
  );
  return data;
};
