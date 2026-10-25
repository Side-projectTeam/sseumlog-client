import axios, { isAxiosError } from "axios";

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
  // 인증 토큰 등 공통 헤더는 여기서 붙인다.
  return config;
});

export function getApiErrorMessage(error: unknown, fallback = "잠시 후 다시 시도해 주세요.") {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
