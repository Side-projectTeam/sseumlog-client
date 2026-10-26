import type { BudgetStatus, HomeSummary } from "@/features/home/types";
import { cn } from "@/lib/cn";

const statusBadge: Record<BudgetStatus, { label: string; className: string }> = {
  good: { label: "적정", className: "bg-[#d8fbcf] text-[#2f7a4f]" },
  warning: { label: "주의", className: "bg-[#fff1c2] text-[#a86b00]" },
  danger: { label: "위험", className: "bg-[#ffe0e0] text-danger" },
};

type Props = {
  summary?: HomeSummary;
  isCurrentMonth: boolean;
  month?: number;
};

export function BudgetCard({ summary, isCurrentMonth, month }: Props) {
  const period = isCurrentMonth || !month ? "이번 달" : `${month}월`;

  return (
    <section
      aria-busy={!summary}
      className="rounded-[14px] bg-white px-[15px] py-4 shadow-[0_4px_20px_rgba(93,94,247,0.12)]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">{period} 사용 가능 금액</h2>
        {summary && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              statusBadge[summary.status].className,
            )}
          >
            {statusBadge[summary.status].label}
          </span>
        )}
      </div>

      {summary ? (
        <>
          <p className="mt-1.5 flex items-baseline gap-1.5 text-primary">
            <span className="text-[34px] leading-tight font-extrabold tracking-tight">
              {summary.availableAmount.toLocaleString("ko-KR")}
            </span>
            <span className="text-base font-bold">원</span>
          </p>
          <p className="mt-1 text-[13px] text-ink/80">{summary.message}</p>
        </>
      ) : (
        <div aria-hidden className="mt-2.5 flex flex-col gap-2.5">
          <div className="h-8 w-40 animate-pulse rounded-md bg-field" />
          <div className="h-4 w-56 animate-pulse rounded-md bg-field" />
        </div>
      )}
    </section>
  );
}
