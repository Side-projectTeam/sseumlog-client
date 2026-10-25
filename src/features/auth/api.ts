import { apiClient, type ApiResponse } from "@/lib/api/client";

import type { LoginForm, SignupForm } from "./schemas";

export type EmailAuthPurpose = "SIGNUP" | "PASSWORD_REST";

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

// TODO: 서버에 로그인 API가 추가되면 연결
export async function login(_body: LoginForm): Promise<never> {
  throw new Error("로그인 API가 아직 준비되지 않았어요.");
}
