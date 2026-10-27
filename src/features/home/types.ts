export type BudgetStatus = "good" | "warning" | "danger";

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
  /** 이번 달 남은 사용 가능 금액 (원) */
  availableAmount: number;
  status: BudgetStatus;
  message: string;
  /** 사용자가 선반에 올려둔 소비 카테고리 (순서대로 배치) */
  categories: CategoryId[];
};
