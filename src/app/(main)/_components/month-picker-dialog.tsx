"use client";

import { useEffect, useId, useRef, useState } from "react";

import { toYearMonth } from "@/hooks/use-current-month";
import { cn } from "@/lib/cn";

type Props = {
  /** 처음 선택되어 있는 달 (`연*12 + 월(0~11)`) */
  value: number;
  /** 고를 수 있는 마지막 달 (이번 달) */
  max: number;
  onApply: (monthIndex: number) => void;
  onClose: () => void;
};

const ITEM_HEIGHT = 32;
const VISIBLE_COUNT = 5;
/** 이번 달 기준 몇 달 전까지 고를 수 있는지 */
const RANGE = 24;

/** 위아래로 굴려서 연·월을 고르는 창 (가운데 줄이 선택된 달) */
export function MonthPickerDialog({ value, max, onApply, onClose }: Props) {
  const titleId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const months = Array.from({ length: RANGE }, (_, i) => max - RANGE + 1 + i);
  const [selected, setSelected] = useState(() => Math.min(max, Math.max(months[0], value)));

  // 처음 열 때 선택된 달을 가운데로 맞춘다.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = months.indexOf(selected) * ITEM_HEIGHT;
    // 열릴 때 한 번만 맞춘다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const scrollTo = (monthIndex: number) => {
    listRef.current?.scrollTo({
      top: months.indexOf(monthIndex) * ITEM_HEIGHT,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-10">
      <div aria-hidden className="absolute inset-0 bg-black/40" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[280px] rounded-xl bg-white px-4 pt-4 pb-4"
      >
        <header className="relative text-center">
          <h2 id={titleId} className="text-[13px] font-medium">
            월 선택
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="absolute -top-1 right-0 p-1"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="relative mt-3" style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}>
          {/* 가운데 선택 줄 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 rounded-md bg-field"
            style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }}
          />
          <ul
            ref={listRef}
            role="listbox"
            aria-labelledby={titleId}
            aria-activedescendant={`${titleId}-${selected}`}
            tabIndex={0}
            onScroll={(e) => {
              const index = Math.round(e.currentTarget.scrollTop / ITEM_HEIGHT);
              const next = months[Math.min(months.length - 1, Math.max(0, index))];
              if (next !== selected) setSelected(next);
            }}
            onKeyDown={(e) => {
              const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const next = selected + step;
              if (next >= months[0] && next <= max) scrollTo(next);
            }}
            className="relative h-full snap-y snap-mandatory [scrollbar-width:none] overflow-y-auto overscroll-contain outline-none [&::-webkit-scrollbar]:hidden"
            style={{ paddingBlock: ITEM_HEIGHT * 2 }}
          >
            {months.map((monthIndex) => {
              const { year, month } = toYearMonth(monthIndex);
              const distance = Math.abs(monthIndex - selected);
              return (
                <li
                  key={monthIndex}
                  id={`${titleId}-${monthIndex}`}
                  role="option"
                  aria-selected={monthIndex === selected}
                  onClick={() => scrollTo(monthIndex)}
                  className={cn(
                    "flex snap-center items-center justify-center text-sm transition-colors",
                    distance === 0
                      ? "font-bold text-ink"
                      : distance === 1
                        ? "text-ink/50"
                        : "text-ink/25",
                  )}
                  style={{ height: ITEM_HEIGHT }}
                >
                  {year}년 {month}월
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => {
            onApply(selected);
            onClose();
          }}
          className="mt-3 h-9 w-full rounded-md bg-primary text-[13px] font-medium text-white"
        >
          적용
        </button>
      </section>
    </div>
  );
}
