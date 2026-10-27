import { getRecordCategories } from "@/features/record/api";
import { getMonthlySummary } from "@/features/spending/api";

import type { HomeSummary } from "./types";

// TODO: 서버에 홈 API가 추가되면 연결. 닉네임·메시지는 시안 값이고,
// 사용 가능 금액과 선반 카테고리는 임시 예산·소비 기록에서 계산한다.
export async function getHomeSummary(yearMonth: string): Promise<HomeSummary> {
  const { remainingBudget } = await getMonthlySummary(yearMonth);
  return {
    nickname: "승은",
    hasUnreadNotification: true,
    availableAmount: remainingBudget,
    status: remainingBudget < 0 ? "danger" : "good",
    message: "이번 달은 식비에 돈을 많이 썼지만 아직 괜찮아요!",
    categories: await getRecordCategories(),
  };
}
