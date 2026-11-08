import type { CategoryId } from "@/features/home/types";
import type { Emotion, Satisfaction } from "@/features/record/types";

// 서버 enum ↔ 화면에서 쓰는 값. 서버 값은 API 경계에서만 쓴다.

export const SERVER_CATEGORY = {
  study: "BOOKS_STATIONERY",
  cafe: "CAFE_SNACK",
  food: "FOOD",
  fashion: "FASHION",
  beauty: "BEAUTY",
  household: "LIVING",
  hobby: "CULTURE_LEISURE",
  etc: "OTHER",
} as const satisfies Record<CategoryId, string>;

export type ServerCategory = (typeof SERVER_CATEGORY)[CategoryId];

export const SERVER_SATISFACTION = {
  VERY_SATISFIED: "VERY_SATISFIED",
  SATISFIED: "SATISFIED",
  NORMAL: "NEUTRAL",
  DISAPPOINTED: "DISAPPOINTED",
} as const satisfies Record<Satisfaction, string>;

export type ServerSatisfaction = (typeof SERVER_SATISFACTION)[Satisfaction];

// 서버 enum 철자가 CONFORTABLE 이다.
export const SERVER_EMOTION = {
  JOY: "JOY",
  PROUD: "PROUD",
  EXCITED: "EXCITED",
  COMFORT: "CONFORTABLE",
  REGRET: "REGRET",
  BURDEN: "BURDEN",
} as const satisfies Record<Emotion, string>;

export type ServerEmotion = (typeof SERVER_EMOTION)[Emotion];

function invert<K extends string, V extends string>(map: Record<K, V>) {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k])) as Record<V, K>;
}

export const fromServerCategory = invert(SERVER_CATEGORY);
export const fromServerSatisfaction = invert(SERVER_SATISFACTION);
export const fromServerEmotion = invert(SERVER_EMOTION);

/** "YYYY-MM" → { year, month } */
export function splitYearMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return { year, month };
}
