import type {
  ApplyClaimResponse,
  FactCheckResponse,
  HistoryResponse,
  IgnoreClaimResponse,
} from "@/types/factcheck";

import { apiClient } from "./client";

interface DeleteFactCheckResponse {
  success: boolean;
}

export interface GetHistoryListParams {
  page?: number;
  limit?: number;
}

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

export const getHistoryList = async (
  params: GetHistoryListParams = {},
): Promise<HistoryResponse> => {
  const { data } = await apiClient.get<HistoryResponse>("/factcheck", { params });
  return data;
};

export const deleteFactCheck = async (factcheckId: string): Promise<DeleteFactCheckResponse> => {
  const { data } = await apiClient.delete<DeleteFactCheckResponse>(`/factcheck/${factcheckId}`);
  return data;
};
