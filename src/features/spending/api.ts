import { getBudget } from "@/features/budget/api";
import { getMonthlyHomeSummary, remainingOf } from "@/features/home/api";

export type MonthlySummary = {
  income: number;
  expense: number;
  /** 목표 예산 중 남은 금액 (넘게 쓰면 음수) */
  remainingBudget: number;
};

export async function getMonthlySummary(yearMonth: string): Promise<MonthlySummary> {
  const [summary, budget] = await Promise.all([
    getMonthlyHomeSummary(yearMonth),
    getBudget(yearMonth),
  ]);
  return {
    income: budget.income,
    expense: summary.totalExpenseAmount,
    remainingBudget: remainingOf(summary),
  };
}
