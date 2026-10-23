import axios, { type AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  // 인증 토큰 등 공통 헤더는 여기서 붙인다.
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 처리, 토큰 갱신 등 공통 에러 처리는 여기서 한다.
    return Promise.reject(error);
  },
);
