"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { resetPassword, sendEmailCode, verifyEmailCode } from "@/features/auth/api";
import {
  findPasswordSchema,
  resetPasswordSchema,
  type FindPasswordForm,
  type ResetPasswordForm,
} from "@/features/auth/schemas";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";

import { ResultCard } from "./result-card";
import { AlertDialog } from "../../_components/alert-dialog";
import { AuthHeader } from "../../_components/auth-header";
import { PrimaryButton } from "../../_components/primary-button";
import { TextField } from "../../_components/text-field";

type Step = "email" | "verify" | "reset" | "done";

export function FindPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  // 비밀번호 재설정 요청에 인증코드를 같이 보내야 해서 들고 있는다.
  const [verificationCode, setVerificationCode] = useState("");

  const sendCodeMutation = useMutation({
    mutationFn: (target: string) => sendEmailCode({ email: target, purpose: "PASSWORD_RESET" }),
  });

  const sendCode = (target: string) =>
    sendCodeMutation.mutate(target, {
      onSuccess: () => {
        setEmail(target);
        setStep("verify");
      },
    });

  const header = {
    email: <AuthHeader title="비밀번호 찾기" backHref="/login" />,
    verify: <AuthHeader title="비밀번호 찾기" onBack={() => setStep("email")} />,
    reset: <AuthHeader title="비밀번호 찾기" onBack={() => setStep("verify")} />,
    done: <AuthHeader title="비밀번호 찾기" backHref="/login" />,
  }[step];

  return (
    <main
      className={cn(
        "flex min-h-dvh flex-col px-5 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+16px)]",
        step === "verify" || step === "done" ? "bg-surface" : "bg-white",
      )}
    >
      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col">
        {header}

        {step === "email" && (
          <EmailStep
            defaultEmail={email}
            pending={sendCodeMutation.isPending}
            onSubmit={sendCode}
          />
        )}
        {step === "verify" && (
          <VerifyStep
            email={email}
            resending={sendCodeMutation.isPending}
            onResend={() => sendCode(email)}
            onVerified={(code) => {
              setVerificationCode(code);
              setStep("reset");
            }}
          />
        )}
        {step === "reset" && (
          <ResetStep
            email={email}
            verificationCode={verificationCode}
            onDone={() => setStep("done")}
          />
        )}
        {step === "done" && (
          <ResultCard
            title="비밀번호 재설정"
            description={
              <>
                비밀번호를 재설정 하였습니다.
                <br />
                앱으로 돌아가 다시 로그인 해주세요.
              </>
            }
          >
            <PrimaryButton
              type="button"
              variant="outline"
              onClick={() => router.replace("/login")}
              className="mt-[30px]"
            >
              로그인으로 돌아가기
            </PrimaryButton>
          </ResultCard>
        )}
      </div>

      {sendCodeMutation.isError && (
        // 가입되지 않은 이메일이면 서버가 메시지 없이 500을 준다.
        <AlertDialog
          message={getApiErrorMessage(sendCodeMutation.error, "가입한 이메일 주소가 아닙니다.")}
          onClose={() => sendCodeMutation.reset()}
        />
      )}
    </main>
  );
}

function EmailStep({
  defaultEmail,
  pending,
  onSubmit,
}: {
  defaultEmail: string;
  pending: boolean;
  onSubmit: (email: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FindPasswordForm>({
    resolver: zodResolver(findPasswordSchema),
    defaultValues: { email: defaultEmail },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.email))}
      noValidate
      className="mt-5 flex flex-col"
    >
      <h2 className="text-xl font-bold">가입 이메일을 입력해주세요</h2>
      <p className="mt-2 text-xs leading-[1.6] text-ink/80">
        가입한 이메일 주소를 입력해주세요.
        <br />
        비밀번호 재설정을 위한 인증번호를 보내드리겠습니다.
      </p>

      <div className="mt-[30px]">
        <TextField
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="이메일"
          placeholder="이메일 입력"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <PrimaryButton type="submit" disabled={pending} className="mt-[17px]">
        확인
      </PrimaryButton>
    </form>
  );
}

function VerifyStep({
  email,
  resending,
  onResend,
  onVerified,
}: {
  email: string;
  resending: boolean;
  onResend: () => void;
  onVerified: (code: string) => void;
}) {
  const [code, setCode] = useState("");

  const verifyMutation = useMutation({
    mutationFn: () => verifyEmailCode({ email, purpose: "PASSWORD_RESET", code }),
    onSuccess: () => onVerified(code),
  });

  const error = verifyMutation.isError ? getApiErrorMessage(verifyMutation.error) : undefined;

  return (
    <ResultCard
      title="확인"
      description={
        <>
          입력된 주소로 비밀번호 재설정이 가능한
          <br />
          이메일을 보냈습니다. 이메일을 확인해주세요.
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code) verifyMutation.mutate();
        }}
        noValidate
        className="mt-[30px] flex flex-col"
      >
        {/* 시안에는 없지만 서버가 인증코드 방식이라 입력칸을 둔다 */}
        <TextField
          id="code"
          aria-label="인증코드"
          autoComplete="one-time-code"
          placeholder="인증코드 입력"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
          error={error}
        />
        <PrimaryButton type="submit" disabled={verifyMutation.isPending} className="mt-[17px]">
          인증 확인
        </PrimaryButton>
        <PrimaryButton
          type="button"
          variant="outline"
          disabled={resending}
          onClick={() => {
            setCode("");
            verifyMutation.reset();
            onResend();
          }}
          className="mt-3"
        >
          다시 보내기
        </PrimaryButton>
      </form>
    </ResultCard>
  );
}

function ResetStep({
  email,
  verificationCode,
  onDone,
}: {
  email: string;
  verificationCode: string;
  onDone: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", newPasswordConfirm: "" },
  });

  const resetMutation = useMutation({ mutationFn: resetPassword, onSuccess: onDone });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        resetMutation.mutate({ email, verificationCode, newPassword: values.newPassword }),
      )}
      noValidate
      className="mt-5 flex flex-col"
    >
      <h2 className="text-xl font-bold">비밀번호를 재설정해주세요.</h2>
      <p className="mt-2 text-xs text-ink/80">새로운 비밀번호를 입력해주세요.</p>

      <div className="mt-[30px] flex flex-col gap-[17px]">
        <TextField
          id="newPassword"
          label="새 비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호 입력"
          hint="8자 이상 ~ 16자 이하의 영문, 숫자, 특수문자를 포함해 주세요."
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <TextField
          id="newPasswordConfirm"
          label="새 비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="새 비밀번호 확인 입력"
          error={errors.newPasswordConfirm?.message}
          {...register("newPasswordConfirm")}
        />
      </div>

      {resetMutation.isError && (
        <p role="alert" className="mt-4 text-center text-sm text-danger">
          {getApiErrorMessage(resetMutation.error)}
        </p>
      )}

      <PrimaryButton type="submit" disabled={resetMutation.isPending} className="mt-[30px]">
        비밀번호 확인
      </PrimaryButton>
    </form>
  );
}
