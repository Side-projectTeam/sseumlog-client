export const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;

/** YYYY-MM-DD → 2026년 10월 07일 */
export function formatFullDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${y}년 ${m}월 ${d}일`;
}

/** 카드 위에 붙는 날짜: 오늘 / 어제 / 10월12일 */
export function formatShortDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - new Date(y, m - 1, d).getTime()) / 86_400_000);
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  return `${m}월${d}일`;
}

/** 오늘 날짜를 YYYY-MM-DD로 (기기 시간대 기준) */
export function todayString() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
