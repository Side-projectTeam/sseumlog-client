"use client";

import Image from "next/image";
import { useState } from "react";

import { CATEGORIES } from "@/features/home/categories";
import { emotionOf } from "@/features/record/options";
import type { CategoryStat } from "@/features/report/api";
import { cn } from "@/lib/cn";

const LAST_MONTH_COLOR = "#f05b9c";

/** 카테고리별 소비 건수 막대. 색·아이콘은 가장 많이 기록된 감정, 점선은 지난달 건수 */
export function EmotionBars({ categories }: { categories: CategoryStat[] }) {
  const [selected, setSelected] = useState(
    () => categories.toSorted((a, b) => b.count - a.count)[0]?.category,
  );
  const max = Math.max(1, ...categories.flatMap((c) => [c.count, c.lastMonthCount]));

  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] text-muted">
        지난달 소비 건수
        <span
          aria-hidden
          className="w-6 border-t border-dashed"
          style={{ borderColor: LAST_MONTH_COLOR }}
        />
      </p>

      <ul className="mt-12 flex justify-between">
        {categories.map((stat) => {
          const isSelected = stat.category === selected;
          const emotion = stat.topEmotion ? emotionOf(stat.topEmotion.emotion) : null;
          const fill = (stat.count / max) * 100;
          const lastMonth = (stat.lastMonthCount / max) * 100;
          const { shortName, name } = CATEGORIES[stat.category];

          return (
            <li key={stat.category} className="relative flex flex-col items-center gap-2">
              {isSelected && (
                <div className="absolute bottom-[calc(100%+6px)] left-1/2 z-[1] -translate-x-1/2 rounded-md bg-white px-2 py-1 text-[10px] whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                  <p>
                    {stat.count}건{" "}
                    <span className="font-bold">{stat.amount.toLocaleString("ko-KR")}원</span>
                  </p>
                  {emotion && stat.topEmotion && (
                    <p className="font-semibold text-primary">
                      {emotion.label} {stat.topEmotion.count}건
                    </p>
                  )}
                </div>
              )}
              <button
                type="button"
                aria-pressed={isSelected}
                aria-label={`${name} ${stat.count}건, 지난달 ${stat.lastMonthCount}건`}
                onClick={() => setSelected(stat.category)}
                className={cn(
                  "relative h-[108px] w-5 rounded-full bg-field",
                  isSelected && "ring-2 ring-offset-1",
                )}
                style={{ ["--tw-ring-color" as string]: LAST_MONTH_COLOR }}
              >
                {stat.count > 0 && emotion && (
                  <span
                    className="absolute inset-x-0 bottom-0 rounded-full"
                    style={{ height: `${fill}%`, background: emotion.color }}
                  >
                    <Image
                      src={emotion.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="absolute -top-2.5 left-1/2 size-5 max-w-none -translate-x-1/2"
                    />
                  </span>
                )}
                {stat.lastMonthCount > 0 && (
                  <span
                    aria-hidden
                    className="absolute -inset-x-1 border-t border-dashed"
                    style={{ bottom: `${lastMonth}%`, borderColor: LAST_MONTH_COLOR }}
                  />
                )}
              </button>
              <span className="text-[10px] text-ink/70">{shortName}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
