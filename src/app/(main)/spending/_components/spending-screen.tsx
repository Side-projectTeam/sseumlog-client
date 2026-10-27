"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { useRecords } from "@/features/record/queries";
import { getMonthlySummary } from "@/features/spending/api";
import { RECORD_SORTS, sortRecords, type RecordSort } from "@/features/spending/sort";
import { toYearMonth, useCurrentMonth } from "@/hooks/use-current-month";

import { SortSheet } from "./sort-sheet";
import { RecordCard } from "../../_components/record/record-card";
import { RecordSheets, type SheetRoute } from "../../_components/record/record-sheets";
import { TriangleButton } from "../../_components/triangle-button";

export function SpendingScreen() {
  const currentMonth = useCurrentMonth();
  const [monthsAgo, setMonthsAgo] = useState(0);
  const [sort, setSort] = useState<RecordSort>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [sheets, setSheets] = useState<SheetRoute[]>([]);

  const selected = currentMonth === null ? null : toYearMonth(currentMonth - monthsAgo);

  const { data: summary } = useQuery({
    queryKey: ["spending-summary", selected?.key],
    queryFn: () => getMonthlySummary(selected!.key),
    enabled: selected !== null,
  });
  const { data: records } = useRecords({ yearMonth: selected?.key }, { enabled: !!selected });

  return (
    <main className="flex flex-1 flex-col bg-white">
      <header className="relative z-[1] flex h-[50px] items-center bg-white px-5 pt-[env(safe-area-inset-top)] shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
        {/* TODO: 로고 이미지로 교체 */}
        <span className="flex size-[22px] items-center justify-center bg-[#d9d9d9] text-[5px] font-bold">
          쓸로그
        </span>
        <h1 className="sr-only">소비</h1>
      </header>

      <section className="px-5 pt-2">
        <div className="flex justify-end">
          <Link
            href="/spending/report"
            className="text-xs text-primary underline underline-offset-2"
          >
            소비 분석 보기
          </Link>
        </div>

        <div className="mt-2 flex h-[90px] items-center rounded-xl bg-primary px-4 text-white">
          <nav aria-label="월 선택" className="flex items-center gap-3">
            <TriangleButton
              direction="prev"
              disabled={!selected}
              onClick={() => setMonthsAgo((n) => n + 1)}
            />
            <p aria-live="polite" className="min-w-[44px] text-center text-xl font-bold">
              {selected ? `${selected.month}월` : ""}
            </p>
            <TriangleButton
              direction="next"
              disabled={monthsAgo === 0}
              onClick={() => setMonthsAgo((n) => n - 1)}
            />
          </nav>
          <span aria-hidden className="mx-5 h-10 w-px bg-white/40" />
          <dl className="grid grid-cols-[auto_auto] items-baseline gap-x-3 gap-y-1">
            <dt className="text-xs text-white/80">수입</dt>
            <dd className="text-[15px] font-bold">{formatWon(summary?.income)}</dd>
            <dt className="text-xs text-white/80">지출</dt>
            <dd className="text-[15px] font-bold">{formatWon(summary?.expense)}</dd>
          </dl>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-medium">한 달 예산</h2>
          <Link href="/spending/budget" className="flex items-center text-xs text-primary">
            예산 설정
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="ml-1 size-4">
              <path
                d="m9 5 7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
        <p className="mt-2 text-[22px] font-bold">
          {summary
            ? summary.remainingBudget >= 0
              ? `${summary.remainingBudget.toLocaleString("ko-KR")}원 남음`
              : `${(-summary.remainingBudget).toLocaleString("ko-KR")}원 초과`
            : " "}
        </p>
      </section>

      <div aria-hidden className="mt-6 h-2 bg-field" />

      <section className="flex flex-1 flex-col px-5 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">소비 기록</h2>
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            className="h-8 rounded-full px-3 text-xs font-medium ring-1 ring-[#d9d9d9] ring-inset"
          >
            {RECORD_SORTS.find((s) => s.value === sort)!.label}
          </button>
        </div>

        {!records ? (
          <ul aria-hidden className="mt-4 grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-field" />
            ))}
          </ul>
        ) : records.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
            <p className="text-[13px] leading-relaxed">
              등록된 소비 기록이 없습니다.
              <br />
              소비를 기록해주세요!
            </p>
            <button
              type="button"
              onClick={() => setSheets([{ type: "create" }])}
              className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-white"
            >
              + 소비 기록하기
            </button>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {sortRecords(records, sort).map((record) => (
              <li key={record.id}>
                <RecordCard
                  record={record}
                  showLike
                  onClick={() => setSheets([{ type: "detail", id: record.id }])}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {sortOpen && <SortSheet value={sort} onChange={setSort} onClose={() => setSortOpen(false)} />}
      {/* 목록 시트는 쓰지 않아서 닉네임은 비워 둔다 */}
      <RecordSheets nickname="" stack={sheets} onChange={setSheets} />
    </main>
  );
}

function formatWon(value?: number) {
  return value === undefined ? "-" : `${value.toLocaleString("ko-KR")} 원`;
}
