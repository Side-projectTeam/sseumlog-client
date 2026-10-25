import type { HomeSummary } from "./types";

// TODO: 서버에 홈 API가 추가되면 연결. 지금은 시안 데이터를 그대로 돌려준다.
export async function getHomeSummary(_yearMonth: string): Promise<HomeSummary> {
  return {
    nickname: "승은",
    hasUnreadNotification: true,
    availableAmount: 132_000,
    status: "good",
    message: "이번 달은 식비에 돈을 많이 썼지만 아직 괜찮아요!",
    categories: ["food", "household", "cafe", "study", "hobby"],
  };
}
