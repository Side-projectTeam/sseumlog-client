import axios, { isAxiosError } from "axios";

import { useAuthStore } from "@/features/auth/store";

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

// 같은 origin의 /api/* 로 요청하고, next.config.ts의 rewrites가 백엔드로 전달한다.
export const apiClient = axios.create({
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().session?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(undefined, (error) => {
  // 토큰을 보냈는데 401이면 만료된 것으로 보고 로그아웃시킨다.
  // (로그인 실패도 401이라 토큰을 보낸 요청만 처리한다)
  if (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    error.config?.headers.Authorization &&
    typeof window !== "undefined"
  ) {
    useAuthStore.getState().clearSession();
    window.location.replace("/login");
  }
  return Promise.reject(error);
});

export function getApiErrorMessage(error: unknown, fallback = "잠시 후 다시 시도해 주세요.") {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
