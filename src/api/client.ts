import axios, { type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/authStore";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const API_TIMEOUT_MS = 60000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/** 토큰 갱신 전용 클라이언트 (interceptor 없음) */
export const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── 토큰 갱신 ──

interface GuestSessionResponse {
  accessToken: string;
  isGuest: boolean;
  remainingUses: number;
}

export const refreshGuestToken = async (): Promise<string> => {
  const { data } = await refreshClient.post<GuestSessionResponse>("/auth/guest");
  useAuthStore.getState().actions.setSession({
    accessToken: data.accessToken,
    isGuest: true,
    remainingUses: data.remainingUses,
  });
  return data.accessToken;
};

export const refreshAuthToken = async (): Promise<string> => {
  const { data } = await refreshClient.post<{ accessToken: string }>("/auth/refresh");
  useAuthStore.getState().actions.setSession({ accessToken: data.accessToken, isGuest: false });
  return data.accessToken;
};

// ── Interceptors ──

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 401 자동 갱신: 동시 요청 큐잉
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  for (const { resolve, reject } of failedQueue) {
    if (token) resolve(token);
    else reject(error);
  }
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // 취소된 요청은 토스트 없이 그대로 throw
    if (axios.isCancel(error)) {
      throw error;
    }

    if (!axios.isAxiosError(error) || !error.config) {
      throw error;
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401이고 아직 재시도 안 했고 토큰 교환 요청이 아니면 → 갱신 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/token"
    ) {
      // 다른 요청이 이미 갱신 중이면 큐에 추가
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { isGuest } = useAuthStore.getState();
        const newToken = isGuest ? await refreshGuestToken() : await refreshAuthToken();

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { isGuest, actions } = useAuthStore.getState();
        if (!isGuest) {
          actions.logout();
        }
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);
