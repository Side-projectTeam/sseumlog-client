import { apiClient, type ApiResponse } from "@/lib/api/client";

import type { FindEmailForm, LoginForm, SignupForm } from "./schemas";

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

export type FindEmailResponse = {
  /** 서버에서 마스킹된 이메일 (예: ho*******@gm*******) */
  email: string;
  /** 가입일 (ISO 8601) */
  createdAt: string;
};

// TODO: 서버에 이메일 찾기 API가 추가되면 연결. 계정이 없으면 에러로 응답한다고 가정한다.
export async function findEmail(_body: FindEmailForm): Promise<ApiResponse<FindEmailResponse>> {
  throw new Error("이메일 찾기 API가 아직 준비되지 않았어요.");
}

// TODO: 서버에 비밀번호 재설정 API가 추가되면 연결. 이메일 인증(PASSWORD_REST)을 마친 뒤 호출한다고 가정한다.
export async function resetPassword(_body: {
  email: string;
  newPassword: string;
}): Promise<ApiResponse<null>> {
  throw new Error("비밀번호 재설정 API가 아직 준비되지 않았어요.");
}
