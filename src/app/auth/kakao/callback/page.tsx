import { Suspense } from "react";

import { KakaoCallback } from "./_components/kakao-callback";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "카카오 로그인 | 쓸로그",
};

export default function KakaoCallbackPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
      <Suspense fallback={<p className="text-sm text-muted">카카오 계정을 확인하고 있어요.</p>}>
        <KakaoCallback />
      </Suspense>
    </main>
  );
}
