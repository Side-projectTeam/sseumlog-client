import { getBudget } from "@/features/budget/api";
import type { CategoryId } from "@/features/home/types";
import { getRecords } from "@/features/record/api";
import { EMOTIONS, emotionOf } from "@/features/record/options";
import type { Emotion, SpendingRecord } from "@/features/record/types";

// 소비 감정 리포트 막대 순서 (시안 기준)
export const REPORT_CATEGORY_ORDER: CategoryId[] = [
  "study",
  "cafe",
  "food",
  "fashion",
  "beauty",
  "household",
  "hobby",
  "etc",
];

export type EmotionStat = {
  emotion: Emotion;
  count: number;
  amount: number;
  /** 전체 건수 중 비율 (0~100) */
  percent: number;
};

export type CategoryStat = {
  category: CategoryId;
  count: number;
  amount: number;
  lastMonthCount: number;
  lastMonthAmount: number;
  /** 가장 많이 기록된 감정 */
  topEmotion: { emotion: Emotion; count: number } | null;
  /** 만족·매우 만족 건수 */
  satisfiedCount: number;
  /** 아쉬움 건수 */
  disappointedCount: number;
};

export type MonthlyReport = {
  totalCount: number;
  emotions: EmotionStat[];
  categories: CategoryStat[];
  /** 만족 비율이 가장 높은 카테고리 */
  best: CategoryStat | null;
  /** 아쉬움 비율이 가장 높은 카테고리 */
  worst: CategoryStat | null;
  /** 가장 많이 쓴 카테고리 */
  topSpending: CategoryStat | null;
  /** best 카테고리의 이번 달 예산 */
  bestBudget: number;
  /** 긍정 감정(기쁨·뿌듯·설렘·편함) 비율 (0~100) */
  positiveRate: number;
  lastMonthPositiveRate: number;
};

const previousMonth = (yearMonth: string) => {
  const [y, m] = yearMonth.split("-").map(Number);
  const date = new Date(y, m - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const positiveRate = (records: SpendingRecord[]) =>
  records.length === 0
    ? 0
    : Math.round(
        (records.filter((r) => emotionOf(r.emotion).positive).length / records.length) * 100,
      );

function topEmotionOf(records: SpendingRecord[]) {
  let top: { emotion: Emotion; count: number } | null = null;
  for (const { value } of EMOTIONS) {
    const count = records.filter((r) => r.emotion === value).length;
    if (count > 0 && (!top || count > top.count)) top = { emotion: value, count };
  }
  return top;
}

const pickBy = (stats: CategoryStat[], score: (s: CategoryStat) => number) =>
  stats
    .filter((s) => score(s) > 0)
    .toSorted((a, b) => score(b) - score(a) || b.count - a.count)[0] ?? null;

// TODO: 서버에 소비 분석 API가 추가되면 연결. 지금은 임시 소비 기록으로 계산한다.
export async function getMonthlyReport(yearMonth: string): Promise<MonthlyReport> {
  const [records, lastMonthRecords, budget] = await Promise.all([
    getRecords({ yearMonth }),
    getRecords({ yearMonth: previousMonth(yearMonth) }),
    getBudget(yearMonth),
  ]);
  const totalCount = records.length;

  const emotions = EMOTIONS.map(({ value }) => {
    const matched = records.filter((r) => r.emotion === value);
    return {
      emotion: value,
      count: matched.length,
      amount: matched.reduce((sum, r) => sum + r.price, 0),
      percent: totalCount ? Math.round((matched.length / totalCount) * 100) : 0,
    };
  }).toSorted((a, b) => b.count - a.count || b.amount - a.amount);

  const categories = REPORT_CATEGORY_ORDER.map((category): CategoryStat => {
    const matched = records.filter((r) => r.category === category);
    const lastMatched = lastMonthRecords.filter((r) => r.category === category);
    return {
      category,
      count: matched.length,
      amount: matched.reduce((sum, r) => sum + r.price, 0),
      lastMonthCount: lastMatched.length,
      lastMonthAmount: lastMatched.reduce((sum, r) => sum + r.price, 0),
      topEmotion: topEmotionOf(matched),
      satisfiedCount: matched.filter(
        (r) => r.satisfaction === "VERY_SATISFIED" || r.satisfaction === "SATISFIED",
      ).length,
      disappointedCount: matched.filter((r) => r.satisfaction === "DISAPPOINTED").length,
    };
  });

  const best = pickBy(categories, (s) => (s.count ? s.satisfiedCount / s.count : 0));

  return {
    totalCount,
    emotions,
    categories,
    best,
    worst: pickBy(categories, (s) => (s.count ? s.disappointedCount / s.count : 0)),
    topSpending: pickBy(categories, (s) => s.amount),
    bestBudget: best ? budget.categories[best.category] : 0,
    positiveRate: positiveRate(records),
    lastMonthPositiveRate: positiveRate(lastMonthRecords),
  };
}
