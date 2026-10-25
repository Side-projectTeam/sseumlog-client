import { FindPasswordFlow } from "./_components/find-password-flow";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비밀번호 찾기 | 쓸로그",
};

export default function FindPasswordPage() {
  return <FindPasswordFlow />;
}
