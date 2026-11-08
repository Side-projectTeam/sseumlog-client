"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { exchangeKakaoCode } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { completeKakaoReauth } from "@/features/user/api";
import { useReauthStore } from "@/features/user/store";
import { getApiErrorMessage } from "@/lib/api/client";

/**
 * 카카오 인증을 마치고 백엔드가 돌려보내는 주소.
 * - code: 카카오 로그인 → 로그인 토큰으로 교환
 * - reauthKey: 회원정보 수정 전 카카오 재인증 → 재인증 토큰으로 교환
 */
export function KakaoCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const setReauthToken = useReauthStore((s) => s.setReauthToken);
  const [error, setError] = useState<string>();
  // 일회용 코드라 개발 모드에서 effect가 두 번 돌아도 한 번만 보낸다.
  const started = useRef(false);

  const code = params.get("code");
  const reauthKey = params.get("reauthKey");
  const missing = !code && !reauthKey;

  useEffect(() => {
    if (started.current || missing) return;
    started.current = true;

    const run = async () => {
      if (reauthKey) {
        setReauthToken(await completeKakaoReauth(reauthKey));
        router.replace("/my/profile");
      } else if (code) {
        setSession(await exchangeKakaoCode(code));
        router.replace("/");
      }
    };
    run().catch((e: unknown) => setError(getApiErrorMessage(e)));
  }, [code, reauthKey, missing, router, setSession, setReauthToken]);

  const message =
    error ?? (missing ? (params.get("message") ?? "카카오 인증에 실패했어요.") : undefined);

  if (!message) {
    return <p className="text-sm text-muted">카카오 계정을 확인하고 있어요.</p>;
  }

  return (
    <>
      <p role="alert" className="text-sm text-danger">
        {message}
      </p>
      <Link
        href={reauthKey ? "/my" : "/login"}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white"
      >
        {reauthKey ? "마이로 돌아가기" : "로그인으로 돌아가기"}
      </Link>
    </>
  );
}
