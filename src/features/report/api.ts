import { getBudget } from "@/features/budget/api";
import type { CategoryId } from "@/features/home/types";
import { getRecords } from "@/features/record/api";
import { EMOTIONS, emotionOf } from "@/features/record/options";
import type { Emotion } from "@/features/record/types";
import { apiClient, type ApiResponse } from "@/lib/api/client";
import {
  fromServerCategory,
  fromServerEmotion,
  splitYearMonth,
  type ServerCategory,
  type ServerEmotion,
} from "@/lib/api/enums";

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

type AnalysisItem<T> = {
  type: T;
  amount: number;
  percentage: number;
  count: number;
  countPercentage: number;
};

type MonthAnalysis = {
  year: number;
  month: number;
  totalAmount: number;
  totalCount: number;
  categories: AnalysisItem<ServerCategory>[];
  emotions: AnalysisItem<ServerEmotion>[];
};

type ExpenseAnalysisResponse = MonthAnalysis & {
  dominantEmotion: { type: ServerEmotion; count: number } | null;
  categoryEmotions: {
    category: ServerCategory;
    emotion: ServerEmotion;
    amount: number;
    count: number;
  }[];
  previousMonth: MonthAnalysis | null;
};

async function getExpenseAnalysis(yearMonth: string) {
  const { year, month } = splitYearMonth(yearMonth);
  const { data } = await apiClient.get<ApiResponse<ExpenseAnalysisResponse>>(
    `/api/expenses/analytics/${year}/${month}`,
  );
  return data.data;
}

const byCategory = (items: AnalysisItem<ServerCategory>[] = [], category: CategoryId) =>
  items.find((item) => fromServerCategory[item.type] === category);

/** 긍정 감정(기쁨·뿌듯·설렘·편함) 건수 비율 */
function positiveRate(analysis: MonthAnalysis | null) {
  if (!analysis?.totalCount) return 0;
  const positive = (analysis.emotions ?? [])
    .filter((item) => emotionOf(fromServerEmotion[item.type]).positive)
    .reduce((sum, item) => sum + item.count, 0);
  return Math.round((positive / analysis.totalCount) * 100);
}

const pickBy = (stats: CategoryStat[], score: (s: CategoryStat) => number) =>
  stats
    .filter((s) => score(s) > 0)
    .toSorted((a, b) => score(b) - score(a) || b.count - a.count)[0] ?? null;

// 금액·건수·감정은 소비 분석 API, 만족도는 분석 API에 없어서 소비 기록에서 센다.
export async function getMonthlyReport(yearMonth: string): Promise<MonthlyReport> {
  const [analysis, records, budget] = await Promise.all([
    getExpenseAnalysis(yearMonth),
    getRecords({ yearMonth }),
    getBudget(yearMonth),
  ]);
  const totalCount = analysis.totalCount;

  const emotions = EMOTIONS.map(({ value }): EmotionStat => {
    const item = analysis.emotions?.find((e) => fromServerEmotion[e.type] === value);
    return {
      emotion: value,
      count: item?.count ?? 0,
      amount: item?.amount ?? 0,
      percent: totalCount ? Math.round(((item?.count ?? 0) / totalCount) * 100) : 0,
    };
  }).toSorted((a, b) => b.count - a.count || b.amount - a.amount);

  const categories = REPORT_CATEGORY_ORDER.map((category): CategoryStat => {
    const current = byCategory(analysis.categories, category);
    const last = byCategory(analysis.previousMonth?.categories, category);
    const matched = records.filter((r) => r.category === category);

    let topEmotion: CategoryStat["topEmotion"] = null;
    for (const item of analysis.categoryEmotions ?? []) {
      if (fromServerCategory[item.category] !== category || item.count <= 0) continue;
      if (!topEmotion || item.count > topEmotion.count) {
        topEmotion = { emotion: fromServerEmotion[item.emotion] as Emotion, count: item.count };
      }
    }

    return {
      category,
      count: current?.count ?? 0,
      amount: current?.amount ?? 0,
      lastMonthCount: last?.count ?? 0,
      lastMonthAmount: last?.amount ?? 0,
      topEmotion,
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
    positiveRate: positiveRate(analysis),
    lastMonthPositiveRate: positiveRate(analysis.previousMonth),
  };
}
