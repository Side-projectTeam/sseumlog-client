"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { sendEmailCode, signup, verifyEmailCode } from "@/features/auth/api";
import { signupSchema, type SignupForm as SignupFormValues } from "@/features/auth/schemas";
import { formatCountdown, useCountdown } from "@/hooks/use-countdown";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";

import { AuthHeader } from "../../_components/auth-header";
import { PhoneField } from "../../_components/phone-field";
import { PrimaryButton } from "../../_components/primary-button";
import { TextField } from "../../_components/text-field";

const CODE_TTL_SECONDS = 180;

type Step = "account" | "profile";

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("account");
  const [code, setCode] = useState("");
  const countdown = useCountdown();

  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", name: "", phoneNumber: "" },
  });

  // TODO: 서버에 휴대폰 인증 API가 생기면 교체. 지금은 1단계에서 입력한 이메일로 인증코드를 보낸다.
  const sendCodeMutation = useMutation({
    mutationFn: () => sendEmailCode({ email: getValues("email"), purpose: "SIGNUP" }),
  });

  const completeMutation = useMutation({
    mutationFn: async (values: SignupFormValues) => {
      await verifyEmailCode({ email: values.email, purpose: "SIGNUP", code });
      return signup(values);
    },
    onSuccess: () => router.replace("/login"),
  });

  const goToProfile = async () => {
    if (await trigger(["email", "password"])) setStep("profile");
  };

  // 발송 응답이 몇 초 걸려서, 누르자마자 인증코드 입력칸과 타이머를 띄우고 발송은 뒤에서 진행한다.
  const sendCode = () => {
    setCode("");
    completeMutation.reset();
    countdown.start(CODE_TTL_SECONDS);
    sendCodeMutation.mutate();
  };

  const requestCode = async () => {
    if (await trigger(["name", "phoneNumber"])) sendCode();
  };

  const onComplete = handleSubmit((values) => {
    if (countdown.expired || !code) return;
    completeMutation.mutate(values);
  });

  const codeSent = countdown.started;
  const codeError = countdown.expired
    ? "제한 시간이 지나 인증코드를 재전송해주세요."
    : completeMutation.isError
      ? getApiErrorMessage(completeMutation.error)
      : undefined;

  return (
    <>
      {step === "account" ? (
        <AuthHeader title="회원가입" backHref="/login" />
      ) : (
        <AuthHeader title="회원가입" onBack={() => setStep("account")} />
      )}

      <form onSubmit={onComplete} noValidate className="mt-10 flex flex-col">
        {step === "account" ? (
          <>
            <div className="flex flex-col gap-[17px]">
              <TextField
                id="email"
                label="이메일"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="이메일 주소 입력"
                error={errors.email?.message}
                {...register("email")}
              />
              <TextField
                id="password"
                label="비밀번호"
                type="password"
                autoComplete="new-password"
                placeholder="비밀번호 입력"
                hint="8자 이상 ~ 16자 이하의 영문, 숫자, 특수문자를 포함해 주세요."
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
            <PrimaryButton type="button" onClick={goToProfile} className="mt-[30px]">
              다음
            </PrimaryButton>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-[17px]">
              <TextField
                id="name"
                label="이름"
                autoComplete="name"
                placeholder="이름 입력"
                error={errors.name?.message}
                {...register("name")}
              />

              <PhoneField
                id="phoneNumber"
                label="휴대폰 번호"
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
              />

              {codeSent && (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <input
                      aria-label="인증코드"
                      autoComplete="one-time-code"
                      placeholder="인증코드 입력"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
                      aria-invalid={!!codeError}
                      aria-describedby={codeError ? "code-message" : undefined}
                      className={cn(
                        "h-[50px] w-full rounded-lg bg-field pr-16 pl-[15px] text-[15px] outline-none",
                        "ring-1 ring-primary placeholder:text-muted",
                        "aria-invalid:bg-white aria-invalid:ring-danger aria-invalid:placeholder:text-danger",
                      )}
                    />
                    {!countdown.expired && (
                      <span className="absolute top-1/2 right-[15px] -translate-y-1/2 text-xs text-danger tabular-nums">
                        {formatCountdown(countdown.remaining)}
                      </span>
                    )}
                  </div>
                  {codeError && (
                    <div className="flex items-start justify-between gap-3">
                      <p id="code-message" role="alert" className="text-xs text-danger">
                        {codeError}
                      </p>
                      {countdown.expired && (
                        <button
                          type="button"
                          onClick={sendCode}
                          disabled={sendCodeMutation.isPending}
                          className="shrink-0 text-xs text-primary disabled:opacity-60"
                        >
                          재전송
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {sendCodeMutation.isError && (
              <p role="alert" className="mt-4 text-center text-sm text-danger">
                {getApiErrorMessage(sendCodeMutation.error)}
              </p>
            )}

            {codeSent ? (
              <PrimaryButton
                type="submit"
                disabled={completeMutation.isPending}
                className="mt-[30px]"
              >
                인증 완료
              </PrimaryButton>
            ) : (
              <PrimaryButton
                type="button"
                onClick={requestCode}
                disabled={sendCodeMutation.isPending}
                className="mt-[30px]"
              >
                인증 하기
              </PrimaryButton>
            )}
          </>
        )}
      </form>
    </>
  );
}
