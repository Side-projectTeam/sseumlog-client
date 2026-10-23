"use client";

import { useOffline } from "next/offline";

export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 bg-zinc-900 px-4 py-2 text-center text-sm text-white"
    >
      오프라인 상태예요. 연결되면 자동으로 다시 시도할게요.
    </div>
  );
}
