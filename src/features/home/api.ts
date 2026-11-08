import { getRecordCategories } from "@/features/record/api";
import { getMyProfile } from "@/features/user/api";
import { apiClient, type ApiResponse } from "@/lib/api/client";
import { splitYearMonth } from "@/lib/api/enums";

import type { BudgetStatus, HomeSummary } from "./types";

export type MonthlyHomeSummaryResponse = {
  year: number;
  month: number;
  budgetConfigured: boolean;
  targetAmount: number | null;
  totalExpenseAmount: number;
  remainingAmount: number | null;
  consumptionStatus: BudgetStatus | null;
  consumptionStatusMessage: string | null;
  exceededAmount: number | null;
};

/** 남은 금액. 예산을 넘게 썼으면 넘은 만큼 음수 */
export const remainingOf = (summary: MonthlyHomeSummaryResponse) =>
  summary.exceededAmount ? -summary.exceededAmount : (summary.remainingAmount ?? 0);

export async function getMonthlyHomeSummary(yearMonth: string) {
  const { year, month } = splitYearMonth(yearMonth);
  const { data } = await apiClient.get<ApiResponse<MonthlyHomeSummaryResponse>>(
    `/api/home/monthly-summary/${year}/${month}`,
  );
  return data.data;
}

export async function getHomeSummary(yearMonth: string): Promise<HomeSummary> {
  const [summary, profile, categories] = await Promise.all([
    getMonthlyHomeSummary(yearMonth),
    getMyProfile(),
    getRecordCategories(),
  ]);
  return {
    nickname: profile.nickname || profile.name,
    // TODO: 알림 API가 생기면 연결
    hasUnreadNotification: false,
    budgetConfigured: summary.budgetConfigured,
    availableAmount: remainingOf(summary),
    status: summary.consumptionStatus ?? "APPROPRIATE",
    message:
      summary.consumptionStatusMessage ??
      (summary.budgetConfigured ? "" : "이번 달 예산을 설정해 주세요."),
    categories,
  };
}
