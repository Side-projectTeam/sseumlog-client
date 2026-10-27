import { FindEmailForm } from "./_components/find-email-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이메일 찾기 | 쓸로그",
};

export default function FindEmailPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-white px-5 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col">
        <FindEmailForm />
      </div>
    </main>
  );
}
