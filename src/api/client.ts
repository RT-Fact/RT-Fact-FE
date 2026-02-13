import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

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
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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
        const { isGuest, actions } = useAuthStore.getState();
        let newToken: string;

        if (isGuest) {
          const { data } = await refreshClient.post<{
            accessToken: string;
            isGuest: boolean;
            remainingUses: number;
          }>("/auth/guest");
          actions.setSession({
            accessToken: data.accessToken,
            isGuest: true,
            remainingUses: data.remainingUses,
          });
          newToken = data.accessToken;
        } else {
          const { data } = await refreshClient.post<{ accessToken: string }>("/auth/refresh");
          actions.setSession({ accessToken: data.accessToken, isGuest: false });
          newToken = data.accessToken;
        }

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

    // HTTP 에러 상태별 토스트
    if (error.response) {
      const { status } = error.response;
      const responseData: unknown = error.response.data;
      const errorCode =
        typeof responseData === "object" && responseData !== null
          ? (responseData as { code?: string }).code
          : undefined;

      switch (status) {
        case 403:
          if (errorCode === "GUEST_LIMIT_EXCEEDED") {
            toast.error("게스트 사용 횟수를 초과했습니다.");
          } else if (errorCode === "GUEST_NOT_ALLOWED") {
            toast.error("로그인이 필요한 기능입니다.");
          } else {
            toast.error("접근 권한이 없습니다.");
          }
          break;
        case 404:
          toast.error("요청한 리소스를 찾을 수 없습니다.");
          break;
        case 500:
          toast.error("서버 오류가 발생했습니다.");
          break;
      }
    } else {
      toast.error("네트워크 오류가 발생했습니다.");
    }

    throw error;
  },
);
