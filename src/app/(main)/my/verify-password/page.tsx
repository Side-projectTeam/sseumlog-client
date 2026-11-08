import { VerifyPasswordForm } from "./_components/verify-password-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비밀번호 확인 | 쓸로그",
};

export default function VerifyPasswordPage() {
  return <VerifyPasswordForm />;
}
