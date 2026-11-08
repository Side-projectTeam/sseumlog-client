import { z } from "zod";

import { emailSchema, passwordSchema, phoneNumberSchema } from "@/features/auth/schemas";

export const verifyPasswordSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

export const profileFormSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, "닉네임을 입력해 주세요.")
    .max(30, "닉네임은 30자까지 쓸 수 있어요."),
  phoneNumber: phoneNumberSchema,
});

/** 카카오로 가입한 계정에 이메일 로그인을 추가할 때 */
export const emailLinkFormSchema = z.object({
  email: z.string().min(1, "이메일을 입력해 주세요.").pipe(emailSchema),
  password: passwordSchema,
});

export const feedbackSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "내용을 입력해 주세요.")
    .max(500, "피드백은 500자까지 쓸 수 있어요."),
});

export type VerifyPasswordForm = z.infer<typeof verifyPasswordSchema>;
export type ProfileForm = z.infer<typeof profileFormSchema>;
export type EmailLinkForm = z.infer<typeof emailLinkFormSchema>;
export type FeedbackForm = z.infer<typeof feedbackSchema>;
