"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

import { BellIcon } from "@/components/icons/nav-icons";
import { getHomeSummary } from "@/features/home/api";
import { toYearMonth, useCurrentMonth } from "@/hooks/use-current-month";

import { BudgetCard } from "./budget-card";
import { CategoryShelves } from "./category-shelves";
import { RecordSheets, type SheetRoute } from "./record/record-sheets";

export function HomeScreen() {
  const currentMonth = useCurrentMonth();
  // 이번 달 기준 몇 달 전을 보고 있는지 (0 = 이번 달)
  const [monthsAgo, setMonthsAgo] = useState(0);
  const [sheets, setSheets] = useState<SheetRoute[]>([]);

  const selected = currentMonth === null ? null : toYearMonth(currentMonth - monthsAgo);

  const { data } = useQuery({
    queryKey: ["home", selected?.key],
    queryFn: () => getHomeSummary(selected!.key),
    enabled: selected !== null,
  });

  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-primary px-5 pt-[env(safe-area-inset-top)] pb-[79px] text-white">
        <header className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* TODO: 프로필 이미지 정해지면 교체 (시안 캡쳐에서 잘라낸 임시 이미지) */}
            <Image
              src="/images/home/profile.png"
              width={44}
              height={44}
              alt=""
              className="size-6 rounded-md"
            />
            <h1 className="text-xl font-bold">{data ? `${data.nickname}의 소비방` : ""}</h1>
          </div>
          {/* TODO: 알림 화면이 생기면 연결 */}
          <button type="button" aria-label="알림" className="relative -mr-1 p-1">
            <BellIcon className="size-6" />
            {data?.hasUnreadNotification && (
              <span className="absolute top-1 right-0.5 size-1.5 rounded-full bg-[#ea3323]" />
            )}
          </button>
        </header>

        <nav aria-label="월 선택" className="mt-[23px] flex h-[30px] items-center gap-1">
          <MonthButton
            direction="prev"
            onClick={() => setMonthsAgo((n) => n + 1)}
            disabled={!selected}
          />
          <p aria-live="polite" className="min-w-[46px] text-center text-lg font-bold">
            {selected ? `${selected.month}월` : ""}
          </p>
          <MonthButton
            direction="next"
            onClick={() => setMonthsAgo((n) => n - 1)}
            disabled={monthsAgo === 0}
          />
        </nav>
      </section>

      <div className="relative -mt-[67px] px-5">
        <BudgetCard summary={data} isCurrentMonth={monthsAgo === 0} month={selected?.month} />
      </div>

      <CategoryShelves
        categories={data?.categories ?? []}
        onSelectCategory={(category) => setSheets([{ type: "list", category }])}
        onAdd={() => setSheets([{ type: "decorate" }])}
      />

      <RecordSheets nickname={data?.nickname ?? ""} stack={sheets} onChange={setSheets} />
    </main>
  );
}

function MonthButton({
  direction,
  ...props
}: { direction: "prev" | "next" } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "이전 달" : "다음 달"}
      className="p-0.5 transition-opacity disabled:opacity-40"
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
        <path
          d={direction === "prev" ? "m15 4-8 8 8 8" : "m9 4 8 8-8 8"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
