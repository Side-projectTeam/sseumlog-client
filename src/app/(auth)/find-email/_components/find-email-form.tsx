"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { findEmail, type FindEmailResponse } from "@/features/auth/api";
import {
  findEmailSchema,
  type FindEmailForm as FindEmailFormValues,
} from "@/features/auth/schemas";
import { getApiErrorMessage } from "@/lib/api/client";

import { AlertDialog } from "../../_components/alert-dialog";
import { AuthHeader } from "../../_components/auth-header";
import { PhoneField } from "../../_components/phone-field";
import { PrimaryButton } from "../../_components/primary-button";
import { TextField } from "../../_components/text-field";

export function FindEmailForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FindEmailFormValues>({
    resolver: zodResolver(findEmailSchema),
    defaultValues: { name: "", phoneNumber: "" },
  });

  const findMutation = useMutation({ mutationFn: findEmail });

  const onSubmit = handleSubmit((values) => findMutation.mutate(values));

  if (findMutation.isSuccess) {
    return (
      <>
        <AuthHeader title="이메일 찾기" onBack={() => findMutation.reset()} />
        <FoundAccount
          phoneNumber={getValues("phoneNumber")}
          account={findMutation.data.data}
          onLogin={() => router.push("/login")}
        />
      </>
    );
  }

  return (
    <>
      <AuthHeader title="이메일 찾기" backHref="/login" />

      <form onSubmit={onSubmit} noValidate className="mt-5 flex flex-col">
        <h2 className="text-xl leading-[1.4] font-bold">
          가입 당시 입력한
          <br />
          이름과 휴대폰 번호를 입력해주세요
        </h2>

        <div className="mt-[30px] flex flex-col gap-[17px]">
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
        </div>

        <PrimaryButton type="submit" disabled={findMutation.isPending} className="mt-[17px]">
          이메일 찾기
        </PrimaryButton>
      </form>

      {findMutation.isError && (
        <AlertDialog
          message={getApiErrorMessage(findMutation.error, "가입된 계정이 없습니다.")}
          onClose={() => findMutation.reset()}
        />
      )}
    </>
  );
}

function FoundAccount({
  phoneNumber,
  account,
  onLogin,
}: {
  phoneNumber: string;
  account: FindEmailResponse;
  onLogin: () => void;
}) {
  return (
    <section className="mt-5 flex flex-col">
      <h2 className="text-xl font-bold">이미 계정이 있습니다</h2>
      <p className="mt-2 text-xs leading-[1.6] text-ink/80">
        +82 {formatPhoneNumber(phoneNumber)}로 가입한 계정이 있습니다.
        <br />이 계정으로 로그인 해주세요.
      </p>

      <div className="mt-[30px] rounded-lg bg-field px-3 py-2">
        <p className="text-sm">{account.email}</p>
      </div>

      <PrimaryButton type="button" onClick={onLogin} className="mt-[17px]">
        로그인 하기
      </PrimaryButton>
    </section>
  );
}

function formatPhoneNumber(value: string) {
  return value.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1 $2 $3");
}
