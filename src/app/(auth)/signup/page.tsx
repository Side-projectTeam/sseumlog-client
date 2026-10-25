import { SignupForm } from "./_components/signup-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | 쓸로그",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-white px-5 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col">
        <SignupForm />
      </div>
    </main>
  );
}
