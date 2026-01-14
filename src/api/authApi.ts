import { apiClient } from "./client";

interface TokenResponse {
  accessToken: string;
}

interface GuestLoginResponse {
  accessToken: string;
  isGuest: boolean;
  remainingUses: number;
}

export const postAuthToken = async (code: string): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>("/auth/token", { code });
  return data;
};

export const postLogout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const postGuestLogin = async (): Promise<GuestLoginResponse> => {
  const { data } = await apiClient.post<GuestLoginResponse>("/auth/guest");
  return data;
};

export const postRefreshToken = async (): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>("/auth/refresh");
  return data;
};
