"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { CATEGORIES } from "@/features/home/categories";
import { emotionOf } from "@/features/record/options";
import { getMonthlyReport, type CategoryStat, type MonthlyReport } from "@/features/report/api";
import { toYearMonth, useCurrentMonth } from "@/hooks/use-current-month";
import { cn } from "@/lib/cn";
import { particle } from "@/lib/korean";

import { CompareBar } from "./compare-bar";
import { EmotionBars } from "./emotion-bars";
import { EmotionSummary } from "./emotion-summary";
import { TriangleButton } from "../../../_components/triangle-button";

export function ReportScreen() {
  const currentMonth = useCurrentMonth();
  const [monthsAgo, setMonthsAgo] = useState(0);
  const selected = currentMonth === null ? null : toYearMonth(currentMonth - monthsAgo);
  const lastMonth = currentMonth === null ? null : toYearMonth(currentMonth - monthsAgo - 1);

  const { data: report } = useQuery({
    queryKey: ["report", selected?.key],
    queryFn: () => getMonthlyReport(selected!.key),
    enabled: selected !== null,
  });

  return (
    <main className="flex flex-1 flex-col bg-field">
      <header className="bg-primary px-5 pt-[env(safe-area-inset-top)] pb-[60px] text-white">
        <div className="flex h-12 items-center">
          <Link href="/spending" aria-label="뒤로 가기" className="-ml-1 p-1">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
              <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <h1 className="sr-only">소비 분석</h1>
        </div>
        <nav aria-label="월 선택" className="mt-3 flex items-center justify-center gap-4">
          <TriangleButton
            direction="prev"
            disabled={!selected}
            onClick={() => setMonthsAgo((n) => n + 1)}
          />
          <p aria-live="polite" className="min-w-[44px] text-center text-lg font-bold">
            {selected ? `${selected.month}월` : ""}
          </p>
          <TriangleButton
            direction="next"
            disabled={monthsAgo === 0}
            onClick={() => setMonthsAgo((n) => n - 1)}
          />
        </nav>
      </header>

      <div className="-mt-11 flex flex-col gap-3 px-4 pb-6">
        {report && selected && lastMonth ? (
          <>
            <EmotionSummary
              month={selected.month}
              totalCount={report.totalCount}
              emotions={report.emotions}
            />
            {report.totalCount > 0 && (
              <Details
                key={selected.key}
                report={report}
                month={selected.month}
                lastMonth={lastMonth.month}
              />
            )}
          </>
        ) : (
          <div aria-hidden className="h-[300px] animate-pulse rounded-xl bg-white" />
        )}
      </div>
    </main>
  );
}

function Details({
  report,
  month,
  lastMonth,
}: {
  report: MonthlyReport;
  month: number;
  lastMonth: number;
}) {
  const topEmotion = report.emotions[0] ? emotionOf(report.emotions[0].emotion) : null;
  const positiveChange = report.positiveRate - report.lastMonthPositiveRate;

  return (
    <section className="flex flex-col gap-8 rounded-xl bg-white px-4 pt-6 pb-4">
      <div>
        <Title>이번 달, 어떤 소비가 좋았나요?</Title>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SatisfactionCard stat={report.best} kind="best" />
          <SatisfactionCard stat={report.worst} kind="worst" />
        </div>
      </div>

      <div>
        <Title className="text-base">소비 감정 리포트</Title>
        <p className="mt-1 text-[11px] text-muted">
          그래프 높이로 소비 건수를, 이모지와 색상으로 가장 많이 기록된 감정을 보여줘요.
        </p>
        <div className="mt-2">
          <EmotionBars categories={report.categories} />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Title>지난 달과 무엇이 달라졌을까요?</Title>
        {report.topSpending && topEmotion && (
          <p className="rounded-lg bg-field px-4 py-3 text-sm leading-relaxed">
            {month}월에는 <Highlight>{CATEGORIES[report.topSpending.category].shortName}</Highlight>
            에 가장 많이 소비하고, <Highlight>{topEmotion.label}</Highlight>
            {particle(topEmotion.label, "을", "를")} 가장 많이 느꼈어요!
          </p>
        )}

        {report.best && (
          <div>
            <h3 className="mb-2 text-[15px] font-medium">
              이번 달 긍정의 <Highlight>{CATEGORIES[report.best.category].shortName}</Highlight>{" "}
              소비
            </h3>
            <CompareBar
              label={`이번 달 ${report.best.amount.toLocaleString("ko-KR")}원, 목표 예산 ${report.bestBudget.toLocaleString("ko-KR")}원, ${lastMonth}월 ${report.best.lastMonthAmount.toLocaleString("ko-KR")}원`}
              value={report.best.amount}
              max={
                Math.max(report.best.amount, report.bestBudget, report.best.lastMonthAmount) *
                  1.3 || 1
              }
              change={signed(report.best.amount - report.best.lastMonthAmount, "원")}
              markers={[
                { value: report.bestBudget, label: "목표 예산", color: "#3fb27f" },
                {
                  value: report.best.lastMonthAmount,
                  label: `${lastMonth}월 소비`,
                  color: "#f05b9c",
                },
              ]}
            />
          </div>
        )}

        <div>
          <h3 className="mb-2 text-[15px] font-medium">소비 감정</h3>
          <CompareBar
            label={`긍정 감정 ${report.positiveRate}%, ${lastMonth}월 ${report.lastMonthPositiveRate}%`}
            value={report.positiveRate}
            max={100}
            change={signed(positiveChange, "%")}
            markers={[
              {
                value: report.lastMonthPositiveRate,
                label: `${lastMonth}월 감정`,
                color: "#f05b9c",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function SatisfactionCard({ stat, kind }: { stat: CategoryStat | null; kind: "best" | "worst" }) {
  const best = kind === "best";
  const color = best ? "text-primary" : "text-[#3fb27f]";

  if (!stat) {
    return (
      <div className="flex min-h-[110px] items-center justify-center rounded-lg px-3 text-center text-xs text-muted ring-1 ring-[#ececec] ring-inset">
        {best ? "아직 만족한 소비가 없어요" : "아쉬운 소비가 없었어요"}
      </div>
    );
  }

  const count = best ? stat.satisfiedCount : stat.disappointedCount;
  const emotion = stat.topEmotion ? emotionOf(stat.topEmotion.emotion) : null;

  return (
    <div className="rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <p className="text-xs leading-relaxed">
        <span className={color}>{CATEGORIES[stat.category].shortName}</span>에서
        <br />
        가장 {best ? "만족한" : "아쉬운"} 소비를 했어요
      </p>
      <p className={cn("mt-1 flex items-baseline gap-1", color)}>
        <span className="text-[9px]">{best ? "긍정" : "부정"}</span>
        <span className="text-xl font-bold">{Math.round((count / stat.count) * 100)}%</span>
      </p>
      <div className="mt-2 flex items-center justify-between">
        {emotion && stat.topEmotion && (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[9px] text-white",
              best ? "bg-primary" : "bg-[#3fb27f]",
            )}
          >
            {emotion.label} {stat.topEmotion.count}건
          </span>
        )}
        <span className="text-[9px] text-muted">
          {count}/{stat.count} 건
        </span>
      </div>
    </div>
  );
}

function Title({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-[17px] font-bold", className)}>{children}</h2>;
}

function Highlight({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

function signed(value: number, unit: string) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "±";
  return `${sign}${Math.abs(value).toLocaleString("ko-KR")}${unit}`;
}
