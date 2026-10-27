import { apiClient, type ApiResponse } from "@/lib/api/client";

import type { FindEmailForm, LoginForm, SignupForm } from "./schemas";

export type EmailAuthPurpose = "SIGNUP" | "PASSWORD_RESET";

export type SignupResponse = {
  id: number;
  email: string;
  name: string;
};

export async function sendEmailCode(body: { email: string; purpose: EmailAuthPurpose }) {
  const { data } = await apiClient.post<ApiResponse<null>>("/api/email-auth/send", body);
  return data;
}

export async function verifyEmailCode(body: {
  email: string;
  purpose: EmailAuthPurpose;
  code: string;
}) {
  const { data } = await apiClient.post<ApiResponse<null>>("/api/email-auth/verify", body);
  return data;
}

export async function signup(body: SignupForm) {
  const { data } = await apiClient.post<ApiResponse<SignupResponse>>("/api/users/signup", body);
  return data;
}

export type LoginResponse = {
  userId: number;
  email: string;
  accessToken: string;
  tokenType: string;
};

export async function login(body: LoginForm) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>("/api/auth/login", body);
  return data;
}

export type FindEmailResponse = {
  /** 서버에서 마스킹된 이메일 */
  email: string;
};

// 계정이 없으면 404 USER_NOT_FOUND로 응답한다.
export async function findEmail(body: FindEmailForm) {
  const { data } = await apiClient.post<ApiResponse<FindEmailResponse>>(
    "/api/users/find-email",
    body,
  );
  return data;
}

// 이메일 인증(PASSWORD_RESET)에 쓴 인증코드를 같이 보낸다.
export async function resetPassword(body: {
  email: string;
  verificationCode: string;
  newPassword: string;
}) {
  const { data } = await apiClient.post<ApiResponse<null>>("/api/users/password/reset", body);
  return data;
}
