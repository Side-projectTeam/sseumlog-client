/** 서버 consumptionStatus: SURPLUS(여유) · APPROPRIATE(적정) · CAUTION(주의) · EXCEEDED(초과) */
export type BudgetStatus = "SURPLUS" | "APPROPRIATE" | "CAUTION" | "EXCEEDED";

export const CATEGORY_IDS = [
  "food",
  "household",
  "cafe",
  "study",
  "hobby",
  "fashion",
  "beauty",
  "etc",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type HomeSummary = {
  nickname: string;
  hasUnreadNotification: boolean;
  /** 이 달 예산을 설정했는지 */
  budgetConfigured: boolean;
  /** 이번 달 남은 사용 가능 금액 (원) */
  availableAmount: number;
  status: BudgetStatus;
  message: string;
  /** 사용자가 선반에 올려둔 소비 카테고리 (순서대로 배치) */
  categories: CategoryId[];
};
