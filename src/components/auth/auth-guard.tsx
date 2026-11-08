"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/store";
import { useHydrated } from "@/hooks/use-hydrated";

/**
 * 로그인하지 않았으면 로그인 화면으로 보낸다. (토큰이 localStorage에 있어서 브라우저에서만 판단)
 * 서버 렌더링(즉시 내비게이션용 프리렌더)에서 화면이 빠지지 않도록 children은 항상 그린다.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const loggedIn = useAuthStore((s) => !!s.session);

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace("/login");
  }, [hydrated, loggedIn, router]);

  return children;
}
