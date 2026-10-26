import { getRecordCategories } from "@/features/record/api";

import type { HomeSummary } from "./types";

// TODO: 서버에 홈 API가 추가되면 연결. 지금은 시안 데이터를 돌려주고,
// 선반 카테고리만 임시 소비 기록에서 뽑아 기록을 추가·삭제하면 선반에도 반영되게 한다.
export async function getHomeSummary(_yearMonth: string): Promise<HomeSummary> {
  return {
    nickname: "승은",
    hasUnreadNotification: true,
    availableAmount: 132_000,
    status: "good",
    message: "이번 달은 식비에 돈을 많이 썼지만 아직 괜찮아요!",
    categories: await getRecordCategories(),
  };
}
