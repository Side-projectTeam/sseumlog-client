"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { reauthWithPassword, startKakaoReauth } from "@/features/user/api";
import { useMyProfile } from "@/features/user/queries";
import { verifyPasswordSchema, type VerifyPasswordForm as Values } from "@/features/user/schemas";
import { useReauthStore } from "@/features/user/store";
import { getApiErrorMessage } from "@/lib/api/client";

import { MyTextField, PASSWORD_HINT } from "../../_components/fields";
import { MyHeader } from "../../_components/my-header";

/** 회원정보 수정 전에 비밀번호(카카오 계정은 카카오 인증)로 한 번 더 확인한다. */
export function VerifyPasswordForm() {
  const router = useRouter();
  const setReauthToken = useReauthStore((s) => s.setReauthToken);
  const { data: profile } = useMyProfile();

  // 이 화면에 다시 들어오면 이전 확인은 무효로 한다.
  useEffect(() => setReauthToken(null), [setReauthToken]);

  const passwordMutation = useMutation({
    mutationFn: reauthWithPassword,
    onSuccess: (token) => {
      setReauthToken(token);
      reset();
      router.push("/my/profile");
    },
  });

  const kakaoMutation = useMutation({
    mutationFn: startKakaoReauth,
    onSuccess: (url) => window.location.assign(url),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(verifyPasswordSchema),
    defaultValues: { password: "" },
  });

  const submit = handleSubmit(({ password }) => passwordMutation.mutate(password));

  const error =
    errors.password?.message ??
    (passwordMutation.isError ? getApiErrorMessage(passwordMutation.error) : undefined);

  return (
    <main className="flex flex-1 flex-col bg-field">
      <MyHeader backHref="/my" />

      <div className="flex flex-col px-4 pt-6">
        <h1 className="text-center text-lg font-semibold">
          {profile && !profile.emailLinked ? "본인 확인" : "비밀번호 확인"}
        </h1>

        {!profile ? (
          <div aria-hidden className="mt-8 h-40 animate-pulse rounded-lg bg-white" />
        ) : profile.emailLinked ? (
          <form onSubmit={submit} noValidate className="flex flex-col">
            <p className="mt-8 text-center text-[13px] leading-5 text-[#555]">
              안전한 개인정보 변경을 위해
              <br />
              비밀번호를 다시 입력해 주세요.
            </p>

            <div className="mt-10">
              <MyTextField
                id="password"
                label="비밀번호"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호 입력"
                hint={PASSWORD_HINT}
                error={error}
                {...register("password", { onChange: () => passwordMutation.reset() })}
              />
            </div>

            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="mt-5 h-[50px] rounded-lg bg-primary text-[15px] font-semibold text-white transition-opacity disabled:opacity-60"
            >
              확인
            </button>
          </form>
        ) : (
          // 카카오로만 가입한 계정은 비밀번호가 없어서 카카오 인증으로 확인한다.
          <>
            <p className="mt-8 text-center text-[13px] leading-5 text-[#555]">
              안전한 개인정보 변경을 위해
              <br />
              카카오 계정으로 한 번 더 인증해 주세요.
            </p>
            {kakaoMutation.isError && (
              <p role="alert" className="mt-4 text-center text-sm text-danger">
                {getApiErrorMessage(kakaoMutation.error)}
              </p>
            )}
            <button
              type="button"
              onClick={() => kakaoMutation.mutate()}
              disabled={kakaoMutation.isPending || kakaoMutation.isSuccess}
              className="mt-10 h-[50px] rounded-lg bg-kakao text-[15px] font-semibold text-ink transition-opacity disabled:opacity-60"
            >
              카카오로 인증하기
            </button>
          </>
        )}
      </div>
    </main>
  );
}
