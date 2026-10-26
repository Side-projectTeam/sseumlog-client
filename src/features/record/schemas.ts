import { z } from "zod";

import { CATEGORY_IDS } from "@/features/home/types";

export const recordFormSchema = z.object({
  imageUrl: z.string().nullable(),
  // 입력칸에는 "12,000"처럼 쉼표가 들어가서 문자열로 받는다.
  price: z
    .string()
    .min(1, "가격을 입력해 주세요.")
    .refine((v) => Number(v.replaceAll(",", "")) > 0, "0원보다 큰 금액을 입력해 주세요."),
  purchasedAt: z.string().min(1, "구매일을 선택해 주세요."),
  category: z.enum(CATEGORY_IDS, "카테고리를 선택해 주세요."),
  satisfaction: z.enum(
    ["VERY_SATISFIED", "SATISFIED", "NORMAL", "DISAPPOINTED"],
    "만족도를 선택해 주세요.",
  ),
  emotion: z.enum(
    ["JOY", "PROUD", "EXCITED", "COMFORT", "REGRET", "BURDEN"],
    "소비 감정을 선택해 주세요.",
  ),
  memo: z.string().max(50, "한줄메모는 50자까지 쓸 수 있어요."),
  place: z.string().max(30, "거래처는 30자까지 쓸 수 있어요."),
});

export type RecordFormValues = z.infer<typeof recordFormSchema>;
