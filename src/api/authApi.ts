import { apiClient } from "./client";

interface TokenResponse {
  accessToken: string;
}

export const postAuthToken = async (code: string): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>("/auth/token", { code });
  return data;
};

export const postLogout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
