import { getBudget } from "@/features/budget/api";
import { getRecords } from "@/features/record/api";

export type MonthlySummary = {
  income: number;
  expense: number;
  /** 목표 예산 중 남은 금액 (넘게 쓰면 음수) */
  remainingBudget: number;
};

// TODO: 서버에 소비 요약 API가 추가되면 연결. 지금은 임시 예산·소비 기록으로 계산한다.
export async function getMonthlySummary(yearMonth: string): Promise<MonthlySummary> {
  const [records, budget] = await Promise.all([getRecords({ yearMonth }), getBudget(yearMonth)]);
  const expense = records.reduce((sum, r) => sum + r.price, 0);
  return { income: budget.income, expense, remainingBudget: budget.targetBudget - expense };
}
