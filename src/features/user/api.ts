import { apiClient, type ApiResponse } from "@/lib/api/client";

import type { EmailLinkRequest, Profile, ProfileUpdate } from "./types";

type MyProfileResponse = {
  userId: number;
  email: string | null;
  name: string | null;
  nickname: string | null;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  emailLinked: boolean;
};

function toProfile(res: MyProfileResponse): Profile {
  return {
    userId: res.userId,
    email: res.email,
    name: res.name ?? "",
    nickname: res.nickname ?? res.name ?? "",
    phoneNumber: res.phoneNumber ?? "",
    imageUrl: res.profileImageUrl || null,
    emailLinked: res.emailLinked,
  };
}

const reauthHeader = (reauthToken: string) => ({ headers: { "X-Reauth-Token": reauthToken } });

export async function getMyProfile() {
  const { data } = await apiClient.get<ApiResponse<MyProfileResponse>>("/api/users/me");
  return toProfile(data.data);
}

// 회원정보 수정 전 재인증. 받은 reauthToken을 X-Reauth-Token 헤더로 보낸다.
export async function reauthWithPassword(currentPassword: string) {
  const { data } = await apiClient.post<ApiResponse<{ reauthToken: string }>>(
    "/api/users/me/reauth/password",
    { currentPassword },
  );
  return data.data.reauthToken;
}

/** 카카오 재인증 시작. 돌려받은 주소로 이동하면 카카오 인증 후 reauthKey를 들고 돌아온다. */
export async function startKakaoReauth() {
  const { data } = await apiClient.post<ApiResponse<{ authorizationUrl: string }>>(
    "/api/users/me/reauth/kakao",
  );
  return data.data.authorizationUrl;
}

export async function completeKakaoReauth(reauthKey: string) {
  const { data } = await apiClient.post<ApiResponse<{ reauthToken: string }>>(
    "/api/users/me/reauth/kakao/complete",
    { reauthKey },
  );
  return data.data.reauthToken;
}

export async function updateMyProfile(update: ProfileUpdate, reauthToken: string) {
  const { data } = await apiClient.put<ApiResponse<MyProfileResponse>>(
    "/api/users/me",
    update,
    reauthHeader(reauthToken),
  );
  return toProfile(data.data);
}

export async function uploadProfileImage(image: File) {
  const form = new FormData();
  form.append("image", image);
  const { data } = await apiClient.put<ApiResponse<MyProfileResponse>>(
    "/api/users/me/profile-image",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return toProfile(data.data);
}

/** 카카오로 가입한 계정에 이메일·비밀번호 로그인을 추가한다. (이메일 인증 PROFILE_EMAIL_LINK 먼저) */
export async function linkEmail(body: EmailLinkRequest, reauthToken: string) {
  const { data } = await apiClient.put<ApiResponse<MyProfileResponse>>(
    "/api/users/me/email-link",
    body,
    reauthHeader(reauthToken),
  );
  return toProfile(data.data);
}

/** 이메일 계정에 카카오 로그인을 연결한다. 돌려받은 카카오 인증 주소로 이동한다. */
export async function startKakaoLink(reauthToken: string) {
  const { data } = await apiClient.post<ApiResponse<{ authorizationUrl: string }>>(
    "/api/users/me/kakao-link",
    undefined,
    reauthHeader(reauthToken),
  );
  return data.data.authorizationUrl;
}

export async function sendFeedback(content: string) {
  await apiClient.post<ApiResponse<null>>("/api/users/me/feedbacks", { content });
}
