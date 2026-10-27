import { z } from "zod";

import { CATEGORY_IDS } from "@/features/home/types";

// 금액 입력칸은 "100,000"처럼 쉼표가 들어간 문자열이다.
export const toAmount = (value: string) => Number(value.replaceAll(",", "") || 0);

const amount = z.string().min(1, "금액을 입력해 주세요.");

export const budgetFormSchema = z
  .object({
    income: amount,
    plannedExpense: amount,
    targetBudget: amount.refine((v) => toAmount(v) > 0, "목표 예산을 입력해 주세요."),
    targetSaving: amount,
    resolution: z.string().max(30, "다짐은 30자까지 쓸 수 있어요."),
    categories: z.object(
      Object.fromEntries(CATEGORY_IDS.map((id) => [id, z.string()])) as Record<
        (typeof CATEGORY_IDS)[number],
        z.ZodString
      >,
    ),
  })
  .refine(
    (v) =>
      Object.values(v.categories).reduce((sum, value) => sum + toAmount(value), 0) <=
      toAmount(v.targetBudget),
    { path: ["categories"], message: "카테고리별 예산의 합이 목표 예산을 넘었어요." },
  );

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
