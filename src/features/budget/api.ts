import { CATEGORY_IDS, type CategoryId } from "@/features/home/types";
import { apiClient, type ApiResponse } from "@/lib/api/client";
import {
  fromServerCategory,
  SERVER_CATEGORY,
  splitYearMonth,
  type ServerCategory,
} from "@/lib/api/enums";

import type { Budget } from "./types";

type PlanCategory = {
  category: ServerCategory;
  calculationPercentage: number;
  amount: number;
};

type MonthlyBudgetPlanResponse = {
  year: number;
  month: number;
  /** 이 달 예산을 아직 설정하지 않았으면 false */
  configured: boolean;
  income: number | null;
  expectedExpense: number | null;
  targetAmount: number | null;
  targetSavings: number | null;
  pledge: string | null;
  categories: PlanCategory[] | null;
};

const planUrl = (yearMonth: string) => {
  const { year, month } = splitYearMonth(yearMonth);
  return `/api/monthly-budgets/${year}/${month}/plan`;
};

function toBudget(plan: MonthlyBudgetPlanResponse): Budget {
  const categories = Object.fromEntries(CATEGORY_IDS.map((id) => [id, 0])) as Record<
    CategoryId,
    number
  >;
  for (const item of plan.categories ?? []) {
    categories[fromServerCategory[item.category]] = item.amount ?? 0;
  }
  return {
    configured: plan.configured,
    income: plan.income ?? 0,
    plannedExpense: plan.expectedExpense ?? 0,
    targetBudget: plan.targetAmount ?? 0,
    targetSaving: plan.targetSavings ?? 0,
    resolution: plan.pledge ?? "",
    categories,
  };
}

export async function getBudget(yearMonth: string) {
  const { data } = await apiClient.get<ApiResponse<MonthlyBudgetPlanResponse>>(planUrl(yearMonth));
  return toBudget(data.data);
}

// 서버는 카테고리 예산을 목표 예산 대비 비율(정수 %)로 받는다.
// 합이 100%를 넘지 않도록 내림한다.
export async function saveBudget(yearMonth: string, budget: Omit<Budget, "configured">) {
  const { data } = await apiClient.put<ApiResponse<MonthlyBudgetPlanResponse>>(planUrl(yearMonth), {
    income: budget.income,
    expectedExpense: budget.plannedExpense,
    targetAmount: budget.targetBudget,
    targetSavings: budget.targetSaving,
    pledge: budget.resolution,
    categories: CATEGORY_IDS.map((id) => ({
      category: SERVER_CATEGORY[id],
      calculationPercentage: budget.targetBudget
        ? Math.floor((budget.categories[id] / budget.targetBudget) * 100)
        : 0,
    })),
  });
  return toBudget(data.data);
}
