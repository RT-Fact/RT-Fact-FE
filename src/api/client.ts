import axios from "axios";

import { useAuthStore } from "@/stores/authStore";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const API_TIMEOUT_MS = 60000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true, // 쿠키 전송/수신 활성화
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

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.status, error.message);
    }
    throw error;
  },
);
