import type { CategoryId } from "@/features/home/types";

export type Satisfaction = "VERY_SATISFIED" | "SATISFIED" | "NORMAL" | "DISAPPOINTED";

export type Emotion = "JOY" | "PROUD" | "EXCITED" | "COMFORT" | "REGRET" | "BURDEN";

export type SpendingRecord = {
  id: number;
  /** 사진 주소. 사진 없이 등록하면 null */
  imageUrl: string | null;
  price: number;
  /** YYYY-MM-DD */
  purchasedAt: string;
  category: CategoryId;
  satisfaction: Satisfaction;
  emotion: Emotion;
  memo: string;
  place: string;
};

export type SpendingRecordInput = Omit<SpendingRecord, "id">;
