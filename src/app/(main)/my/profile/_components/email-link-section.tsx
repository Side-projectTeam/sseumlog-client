"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { sendEmailCode, verifyEmailCode } from "@/features/auth/api";
import { emailLinkFormSchema, type EmailLinkForm } from "@/features/user/schemas";
import { formatCountdown, useCountdown } from "@/hooks/use-countdown";
import { getApiErrorMessage } from "@/lib/api/client";

import { MyTextField, PASSWORD_HINT } from "../../_components/fields";

const CODE_TTL_SECONDS = 180;

/**
 * 카카오로만 가입한 계정에 이메일·비밀번호 로그인을 추가하는 입력 상태.
 * 이메일을 비워 두면 연결하지 않고, 적었으면 인증코드까지 받아야 저장된다.
 */
export function useEmailLink() {
  const form = useForm<EmailLinkForm>({
    resolver: zodResolver(emailLinkFormSchema),
    defaultValues: { email: "", password: "" },
  });
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const countdown = useCountdown();

  const sendMutation = useMutation({
    mutationFn: (email: string) => sendEmailCode({ email, purpose: "PROFILE_EMAIL_LINK" }),
  });

  const filled = () => {
    const { email, password } = form.getValues();
    return !!(email || password);
  };

  return {
    form,
    code,
    setCode: (value: string) => {
      setCode(value);
      setCodeError(undefined);
    },
    codeError,
    countdown,
    sendMutation,
    async requestCode() {
      if (!(await form.trigger("email"))) return;
      setCode("");
      setCodeError(undefined);
      countdown.start(CODE_TTL_SECONDS);
      sendMutation.mutate(form.getValues("email"));
    },
    /** 저장 전에 입력값을 검사한다. 아무것도 안 적었으면 통과 */
    async validate() {
      if (!filled()) return true;
      if (!(await form.trigger())) return false;
      if (!countdown.started) {
        setCodeError("이메일 인증을 진행해 주세요.");
        return false;
      }
      if (countdown.expired) {
        setCodeError("제한 시간이 지나 인증코드를 재전송해 주세요.");
        return false;
      }
      if (!code) {
        setCodeError("인증코드를 입력해 주세요.");
        return false;
      }
      return true;
    },
    /** 인증코드를 확인하고 연결할 이메일·비밀번호를 돌려준다. 연결 안 하면 null */
    async prepare() {
      if (!filled()) return null;
      const { email, password } = form.getValues();
      await verifyEmailCode({ email, purpose: "PROFILE_EMAIL_LINK", code });
      return { email, password };
    },
  };
}

type Link = ReturnType<typeof useEmailLink>;

export function EmailLinkSection({ link }: { link: Link }) {
  const {
    register,
    formState: { errors },
  } = link.form;
  const { countdown, sendMutation } = link;

  const codeError =
    link.codeError ?? (sendMutation.isError ? getApiErrorMessage(sendMutation.error) : undefined);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <MyTextField
          id="email"
          label="이메일"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="이메일 주소 입력"
          error={errors.email?.message}
          {...register("email")}
        />
        <button
          type="button"
          onClick={() => link.requestCode()}
          disabled={sendMutation.isPending}
          className="h-10 rounded-lg border border-primary bg-white text-[13px] font-semibold text-primary disabled:opacity-60"
        >
          {countdown.started ? "인증코드 재전송" : "인증코드 받기"}
        </button>
        {countdown.started && (
          <div className="relative">
            <input
              aria-label="인증코드"
              autoComplete="one-time-code"
              placeholder="인증코드 입력"
              value={link.code}
              onChange={(e) => link.setCode(e.target.value.replace(/\s/g, ""))}
              aria-invalid={!!codeError}
              className="h-[46px] w-full rounded-lg bg-white pr-16 pl-4 text-sm ring-1 ring-primary outline-none placeholder:text-[#b5b5b5] aria-invalid:ring-danger"
            />
            {!countdown.expired && (
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-danger tabular-nums">
                {formatCountdown(countdown.remaining)}
              </span>
            )}
          </div>
        )}
        {codeError && (
          <p role="alert" className="text-[11px] text-danger">
            {codeError}
          </p>
        )}
        {!countdown.started && !codeError && (
          <p className="text-[11px] text-muted">
            이메일을 연결하면 이메일과 비밀번호로도 로그인할 수 있어요.
          </p>
        )}
      </div>
      <MyTextField
        id="password"
        label="비밀번호"
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호 입력"
        hint={PASSWORD_HINT}
        error={errors.password?.message}
        {...register("password")}
      />
    </div>
  );
}
