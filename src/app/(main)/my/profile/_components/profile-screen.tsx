"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { linkEmail, startKakaoLink, updateMyProfile } from "@/features/user/api";
import { useMyProfile, useSetMyProfile, useUploadProfileImage } from "@/features/user/queries";
import { profileFormSchema, type ProfileForm } from "@/features/user/schemas";
import { useReauthStore } from "@/features/user/store";
import type { Profile } from "@/features/user/types";
import { useHydrated } from "@/hooks/use-hydrated";
import { getApiErrorMessage } from "@/lib/api/client";

import { EmailLinkSection, useEmailLink } from "./email-link-section";
import { MyPhoneField, MyTextField } from "../../_components/fields";
import { MyHeader } from "../../_components/my-header";
import { ProfileAvatar } from "../../_components/profile-avatar";

export function ProfileScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  // 토큰은 sessionStorage에 있어서 서버 렌더링 때는 알 수 없다.
  const storedToken = useReauthStore((s) => s.reauthToken);
  const reauthToken = hydrated ? storedToken : null;
  const { data: profile } = useMyProfile();

  // 재인증을 거치지 않고 들어오면 확인 화면으로 보낸다.
  useEffect(() => {
    if (hydrated && !reauthToken) router.replace("/my/verify-password");
  }, [hydrated, reauthToken, router]);

  return (
    <main className="flex flex-1 flex-col bg-field">
      <MyHeader backHref="/my" />

      <div className="flex flex-1 flex-col px-4 pt-6">
        <h1 className="text-center text-lg font-semibold">회원정보 수정</h1>
        {reauthToken && profile ? (
          <ProfileEditForm profile={profile} reauthToken={reauthToken} />
        ) : (
          <div aria-hidden className="mx-auto mt-8 size-[84px] animate-pulse rounded-full bg-white" />
        )}
      </div>
    </main>
  );
}

function ProfileEditForm({ profile, reauthToken }: { profile: Profile; reauthToken: string }) {
  const router = useRouter();
  const setReauthToken = useReauthStore((s) => s.setReauthToken);
  const setProfile = useSetMyProfile();
  const imageMutation = useUploadProfileImage();
  const fileRef = useRef<HTMLInputElement>(null);
  const emailLink = useEmailLink();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { nickname: profile.nickname, phoneNumber: profile.phoneNumber },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: ProfileForm) => {
      // 카카오 계정에 이메일 로그인을 추가하는 경우 먼저 이메일을 연결한다.
      const link = await emailLink.prepare();
      if (link) {
        await linkEmail(
          { ...link, name: profile.name, phoneNumber: values.phoneNumber },
          reauthToken,
        );
      }
      return updateMyProfile(values, reauthToken);
    },
    onSuccess: async (updated) => {
      await setProfile(updated);
      setReauthToken(null);
      router.push("/my");
    },
  });

  const kakaoLinkMutation = useMutation({
    mutationFn: () => startKakaoLink(reauthToken),
    onSuccess: (url) => window.location.assign(url),
  });

  const submit = handleSubmit(async (values) => {
    if (!(await emailLink.validate())) return;
    saveMutation.mutate(values);
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={imageMutation.isPending}
        className="relative mx-auto mt-8 overflow-hidden rounded-full disabled:opacity-60"
      >
        <ProfileAvatar imageUrl={profile.imageUrl} size={84} />
        <span
          className={
            profile.imageUrl
              ? "absolute inset-x-0 bottom-0 bg-black/40 py-1 text-[11px] text-white"
              : "absolute inset-0 flex items-center justify-center text-xs text-muted"
          }
        >
          {imageMutation.isPending ? "올리는 중" : "사진 변경"}
        </span>
      </button>
      {/* 사진은 고르면 바로 올린다 (재인증 없이 바꿀 수 있는 API) */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) imageMutation.mutate(file);
          e.target.value = "";
        }}
      />
      {imageMutation.isError && (
        <p role="alert" className="mt-2 text-center text-xs text-danger">
          {getApiErrorMessage(imageMutation.error)}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-5">
        <MyTextField
          id="nickname"
          label="닉네임"
          autoComplete="nickname"
          placeholder="닉네임 입력"
          maxLength={30}
          error={errors.nickname?.message}
          {...register("nickname")}
        />
        {profile.emailLinked ? (
          <MyTextField
            id="email"
            label="이메일"
            type="email"
            value={profile.email ?? ""}
            readOnly
            className="text-muted"
          />
        ) : (
          <EmailLinkSection link={emailLink} />
        )}
        <MyPhoneField
          id="phoneNumber"
          label="휴대폰 번호"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            },
          })}
        />

        {profile.emailLinked && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => kakaoLinkMutation.mutate()}
              disabled={kakaoLinkMutation.isPending || kakaoLinkMutation.isSuccess}
              className="h-[46px] rounded-lg bg-kakao text-sm font-semibold text-ink transition-opacity disabled:opacity-60"
            >
              카카오 계정 연결하기
            </button>
            {kakaoLinkMutation.isError && (
              <p role="alert" className="text-[11px] text-danger">
                {getApiErrorMessage(kakaoLinkMutation.error)}
              </p>
            )}
          </div>
        )}
      </div>

      {saveMutation.isError && (
        <p role="alert" className="mt-4 text-center text-sm text-danger">
          {getApiErrorMessage(saveMutation.error)}
        </p>
      )}

      {/* 하단 탭 위에 떠 있는 저장 버튼 */}
      <div className="sticky bottom-[calc(60px+env(safe-area-inset-bottom)+12px)] mt-auto pt-6 pb-3">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="h-[50px] w-full rounded-lg bg-primary text-[15px] font-semibold text-white transition-opacity disabled:opacity-60"
        >
          저장
        </button>
      </div>
    </form>
  );
}
