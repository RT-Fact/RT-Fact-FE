import type { ApiKey, ApiKeyCreateResponse } from "@/types/apiKey";

import { apiClient } from "./client";

export const getApiKeys = async (): Promise<ApiKey[]> => {
  const response = await apiClient.get<ApiKey[]>("/api-keys");
  return response.data;
};

export const createApiKey = async (name: string): Promise<ApiKeyCreateResponse> => {
  const response = await apiClient.post<ApiKeyCreateResponse>("/api-keys", { name });
  return response.data;
};

export const deleteApiKey = async (id: string): Promise<void> => {
  await apiClient.delete(`/api-keys/${id}`);
};
