"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useBudget, useSaveBudget } from "@/features/budget/queries";
import { budgetFormSchema, toAmount, type BudgetFormValues } from "@/features/budget/schemas";
import type { Budget } from "@/features/budget/types";
import { CATEGORIES } from "@/features/home/categories";
import { CATEGORY_IDS } from "@/features/home/types";
import { REPORT_CATEGORY_ORDER } from "@/features/report/api";
import { toYearMonth, useCurrentMonth } from "@/hooks/use-current-month";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";

export function BudgetScreen() {
  const currentMonth = useCurrentMonth();
  const month = currentMonth === null ? null : toYearMonth(currentMonth);
  const { data: budget } = useBudget(month?.key);

  return (
    <main className="flex flex-1 flex-col bg-field">
      <header className="relative z-[1] flex h-12 items-center bg-white px-4 pt-[env(safe-area-inset-top)] shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
        <Link href="/spending" aria-label="뒤로 가기" className="-ml-1 p-1">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
            <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <h1 className="ml-1 text-lg font-bold">예산 설정</h1>
      </header>

      <div className="flex flex-1 flex-col px-4 pt-5">
        <h2 className="text-lg font-bold">
          <span className="text-primary">{month ? `${month.month}월` : ""}</span> 예산 설정
        </h2>
        {budget && month ? (
          <BudgetForm key={month.key} yearMonth={month.key} budget={budget} />
        ) : (
          <div aria-hidden className="mt-3 h-[300px] animate-pulse rounded-xl bg-white" />
        )}
      </div>
    </main>
  );
}

const format = (value: number) => value.toLocaleString("ko-KR");

function toFormValues(budget: Budget): BudgetFormValues {
  return {
    income: format(budget.income),
    plannedExpense: format(budget.plannedExpense),
    targetBudget: format(budget.targetBudget),
    targetSaving: format(budget.targetSaving),
    resolution: budget.resolution,
    categories: Object.fromEntries(
      CATEGORY_IDS.map((id) => [id, format(budget.categories[id])]),
    ) as BudgetFormValues["categories"],
  };
}

function BudgetForm({ yearMonth, budget }: { yearMonth: string; budget: Budget }) {
  const router = useRouter();
  const saveMutation = useSaveBudget(yearMonth);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: toFormValues(budget),
  });

  const submit = handleSubmit((values) =>
    saveMutation.mutate(
      {
        income: toAmount(values.income),
        plannedExpense: toAmount(values.plannedExpense),
        targetBudget: toAmount(values.targetBudget),
        targetSaving: toAmount(values.targetSaving),
        resolution: values.resolution.trim(),
        categories: Object.fromEntries(
          CATEGORY_IDS.map((id) => [id, toAmount(values.categories[id])]),
        ) as Budget["categories"],
      },
      { onSuccess: () => router.push("/spending") },
    ),
  );

  const amountFields = [
    { name: "income", label: "수입" },
    { name: "plannedExpense", label: "예정 지출" },
    { name: "targetBudget", label: "목표 예산" },
    { name: "targetSaving", label: "목표 저축액" },
  ] as const;

  return (
    <form onSubmit={submit} noValidate className="mt-3 flex flex-1 flex-col gap-3">
      <section className="flex flex-col gap-3 rounded-xl bg-white p-4">
        {amountFields.map(({ name, label }) => (
          <Row key={name} label={label} htmlFor={name} error={errors[name]?.message}>
            <AmountInput control={control} name={name} id={name} />
          </Row>
        ))}
        <Row label="다짐" htmlFor="resolution" error={errors.resolution?.message}>
          <input
            id="resolution"
            maxLength={30}
            placeholder="이번 달 다짐"
            className={inputClass}
            {...register("resolution")}
          />
        </Row>
      </section>

      <section className="rounded-xl bg-white p-4">
        <h3 className="text-[13px] font-bold">카테고리별 예산</h3>
        <p className="mt-0.5 text-[10px] text-muted">
          ※ 카테고리별 예산은 목표 예산 내에서 설정 가능합니다.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {REPORT_CATEGORY_ORDER.map((id) => (
            <li key={id} className="flex items-center gap-1.5">
              <label htmlFor={`category-${id}`} className="flex-1 text-[13px]">
                {CATEGORIES[id].name}
              </label>
              <div className="w-[104px]">
                <AmountInput
                  control={control}
                  name={`categories.${id}`}
                  id={`category-${id}`}
                  align="right"
                />
              </div>
              <CategoryPercent control={control} id={id} />
            </li>
          ))}
        </ul>
        {errors.categories?.root?.message || errors.categories?.message ? (
          <p role="alert" className="mt-2 text-[11px] text-danger">
            {errors.categories?.root?.message ?? errors.categories?.message}
          </p>
        ) : null}
      </section>

      {saveMutation.isError && (
        <p role="alert" className="text-center text-sm text-danger">
          {getApiErrorMessage(saveMutation.error)}
        </p>
      )}

      {/* 하단 탭 위에 떠 있는 저장 버튼 */}
      <div className="sticky bottom-[calc(60px+env(safe-area-inset-bottom)+12px)] mt-auto pt-2 pb-3">
        <Button type="submit" disabled={saveMutation.isPending} className="w-full rounded-xl">
          저장
        </Button>
      </div>
    </form>
  );
}

/** 목표 예산 대비 카테고리 예산 비율 */
function CategoryPercent({
  control,
  id,
}: {
  control: Control<BudgetFormValues>;
  id: (typeof CATEGORY_IDS)[number];
}) {
  const [target, value] = useWatch({ control, name: ["targetBudget", `categories.${id}`] });
  const targetAmount = toAmount(target);
  const percent = targetAmount ? Math.round((toAmount(value) / targetAmount) * 100) : 0;

  return (
    <span className="flex h-10 w-11 items-center justify-center rounded-md bg-field text-[13px]">
      {percent}%
    </span>
  );
}

type AmountName =
  | "income"
  | "plannedExpense"
  | "targetBudget"
  | "targetSaving"
  | `categories.${(typeof CATEGORY_IDS)[number]}`;

function AmountInput({
  control,
  name,
  id,
  align = "left",
}: {
  control: Control<BudgetFormValues>;
  name: AmountName;
  id: string;
  align?: "left" | "right";
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="relative">
          <input
            id={id}
            inputMode="numeric"
            placeholder="0"
            aria-invalid={!!fieldState.error}
            className={cn(inputClass, "pr-7", align === "right" && "text-right")}
            {...field}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
              field.onChange(digits ? Number(digits).toLocaleString("ko-KR") : "");
            }}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[13px]">
            원
          </span>
        </div>
      )}
    />
  );
}

const inputClass =
  "h-10 w-full rounded-md bg-field px-3 text-[13px] outline-none ring-primary focus:ring-1 aria-invalid:ring-1 aria-invalid:ring-danger";

function Row({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start">
      <label htmlFor={htmlFor} className="w-[82px] shrink-0 pt-2.5 text-[13px]">
        {label}
      </label>
      <div className="min-w-0 flex-1">
        {children}
        {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
      </div>
    </div>
  );
}
