import { useCallback, useEffect, useState } from "react";

// 남은 시간을 초 단위로 센다. start 전에는 remaining이 0이고 expired는 false.
export function useCountdown() {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (endAt === null) return;
    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endAt) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [endAt]);

  const start = useCallback((seconds: number) => {
    const current = Date.now();
    setNow(current);
    setEndAt(current + seconds * 1000);
  }, []);

  const remaining = endAt === null ? 0 : Math.max(0, Math.ceil((endAt - now) / 1000));

  return {
    remaining,
    started: endAt !== null,
    expired: endAt !== null && remaining === 0,
    start,
  };
}

export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
