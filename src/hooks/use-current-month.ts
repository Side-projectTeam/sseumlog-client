import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function getSnapshot() {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
}

/**
 * 사용자 기기 기준 이번 달을 `연*12 + 월(0~11)` 숫자로 돌려준다.
 * 서버 렌더링(프리렌더) 때는 날짜를 알 수 없어 null.
 */
export function useCurrentMonth() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function toYearMonth(monthIndex: number) {
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  return { year, month, key: `${year}-${String(month).padStart(2, "0")}` };
}
