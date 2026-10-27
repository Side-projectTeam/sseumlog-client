import type { CategoryId } from "@/features/home/types";

export type Budget = {
  income: number;
  plannedExpense: number;
  /** 한 달에 쓰기로 한 금액. 카테고리별 예산의 합은 이 금액을 넘을 수 없다. */
  targetBudget: number;
  targetSaving: number;
  resolution: string;
  categories: Record<CategoryId, number>;
};
