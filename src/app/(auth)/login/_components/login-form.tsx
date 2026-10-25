"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { KakaoTalkIcon } from "@/components/icons/kakao-talk-icon";
import { login } from "@/features/auth/api";
import { loginSchema, type LoginForm as LoginFormValues } from "@/features/auth/schemas";
import { getApiErrorMessage } from "@/lib/api/client";

import { TextField } from "../../_components/text-field";

const findLinks = [
  { href: "/find-email", label: "이메일 찾기" },
  { href: "/find-password", label: "비밀번호 찾기" },
];

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({ mutationFn: login });

  const onSubmit = handleSubmit((values) => loginMutation.mutate(values));

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col">
      <div className="flex flex-col gap-[17px]">
        <TextField
          id="email"
          label="이메일"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="이메일 입력"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="password"
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호 입력"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <nav aria-label="계정 찾기 및 회원가입" className="mt-[15px] flex justify-end">
        <ul className="flex items-center text-[11px] text-muted">
          {findLinks.map(({ href, label }) => (
            <li key={href} className="after:mx-2 after:text-[#d9d9d9] after:content-['|']">
              <Link href={href}>{label}</Link>
            </li>
          ))}
          <li>
            <Link href="/signup" className="text-ink">
              회원가입
            </Link>
          </li>
        </ul>
      </nav>

      {loginMutation.isError && (
        <p role="alert" className="mt-4 text-center text-sm text-danger">
          {getApiErrorMessage(loginMutation.error)}
        </p>
      )}

      <div className="mt-10 flex flex-col gap-[15px]">
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-[50px] rounded-lg bg-ink text-base font-semibold text-white transition-opacity disabled:opacity-60"
        >
          로그인
        </button>
        {/* TODO: 카카오 로그인 API가 생기면 연결 */}
        <button
          type="button"
          className="relative flex h-[50px] items-center justify-center rounded-lg bg-kakao text-base font-semibold text-ink"
        >
          <KakaoTalkIcon className="absolute left-[22px] h-6 w-[27px] text-ink" />
          카카오로 시작하기
        </button>
      </div>
    </form>
  );
}
