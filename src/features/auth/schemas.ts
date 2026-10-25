import { z } from "zod";

// 서버 SignupRequest 검증 규칙과 동일하게 맞춘다.
const email = z.email("올바른 이메일 형식이 아니에요.");

const password = z
  .string()
  .min(8, "비밀번호는 8~16자로 입력해 주세요.")
  .max(16, "비밀번호는 8~16자로 입력해 주세요.")
  .regex(
    /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
    "영문, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 주세요.",
  );

export const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해 주세요.").pipe(email),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

export const signupSchema = z.object({
  email: z.string().min(1, "이메일을 입력해 주세요.").pipe(email),
  password,
  name: z
    .string()
    .min(2, "이름은 2~10자로 입력해 주세요.")
    .max(10, "이름은 2~10자로 입력해 주세요.")
    .regex(/^[가-힣a-zA-Z ]+$/, "이름은 한글 또는 영문만 입력할 수 있어요."),
  phoneNumber: z.string().regex(/^010[0-9]{8}$/, "010으로 시작하는 숫자 11자리를 입력해 주세요."),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
