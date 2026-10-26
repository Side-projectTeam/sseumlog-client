import Image from "next/image";

import { emotionOf } from "@/features/record/options";
import type { EmotionStat } from "@/features/report/api";
import { josa } from "@/lib/korean";

type Props = {
  month: number;
  totalCount: number;
  emotions: EmotionStat[];
};

export function EmotionSummary({ month, totalCount, emotions }: Props) {
  const top = emotions[0];

  if (totalCount === 0 || !top) {
    return (
      <section className="rounded-xl bg-white px-4 py-10 text-center shadow-[0_4px_20px_rgba(93,94,247,0.12)]">
        <p className="text-sm text-muted">{month}월에는 아직 소비 기록이 없어요.</p>
      </section>
    );
  }

  const topEmotion = emotionOf(top.emotion);

  return (
    <section className="rounded-xl bg-white px-4 pt-5 pb-6 shadow-[0_4px_20px_rgba(93,94,247,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-primary">{josa(topEmotion.label, "이", "가")}</p>
          <h2 className="text-lg font-bold">가장 많이 남은 {month}월이에요!</h2>
          <p className="mt-1 text-[11px] text-muted">
            소비 {totalCount}건 중 {top.count}건
          </p>
        </div>
        <Image src={topEmotion.icon} alt="" width={44} height={44} className="size-11" />
      </div>

      <div className="mt-6 flex items-center gap-5">
        <Donut emotions={emotions} label={topEmotion.label} percent={top.percent} />
        <ul className="flex flex-1 flex-col gap-2">
          {emotions.map(({ emotion, percent, amount }) => {
            const { label, color } = emotionOf(emotion);
            return (
              <li key={emotion} className="flex items-center text-[11px]">
                <span
                  aria-hidden
                  className="mr-1.5 size-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="flex-1">
                  {label} <span className="font-semibold">{percent}%</span>
                </span>
                <span className="font-semibold">{amount.toLocaleString("ko-KR")}원</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Donut({
  emotions,
  label,
  percent,
}: {
  emotions: EmotionStat[];
  label: string;
  percent: number;
}) {
  const total = emotions.reduce((sum, e) => sum + e.count, 0);
  // 각 조각의 길이와 시작 위치(앞 조각들의 길이 합)
  const segments = emotions
    .filter((e) => e.count > 0)
    .map((e) => ({ emotion: e.emotion, length: (e.count / total) * CIRCUMFERENCE }))
    .map((segment, i, all) => ({
      ...segment,
      start: all.slice(0, i).reduce((sum, s) => sum + s.length, 0),
    }));

  return (
    <div className="relative size-[130px] shrink-0">
      <svg viewBox="0 0 130 130" aria-hidden className="size-full -rotate-90">
        {segments.map(({ emotion, length, start }) => (
          <circle
            key={emotion}
            cx="65"
            cy="65"
            r={RADIUS}
            fill="none"
            stroke={emotionOf(emotion).color}
            strokeWidth="24"
            strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
            strokeDashoffset={-start}
          />
        ))}
      </svg>
      <p className="absolute inset-0 flex flex-col items-center justify-center text-primary">
        <span className="text-xs">{label}</span>
        <span className="text-base font-bold">{percent}%</span>
      </p>
    </div>
  );
}
