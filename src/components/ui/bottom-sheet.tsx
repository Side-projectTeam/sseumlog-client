"use client";

import { useEffect, useId, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  /** primary: 보라색 헤더 (소비 기록 모아보기) */
  variant?: "default" | "primary";
  titleAlign?: "start" | "center";
  /** 작은 제목 + 닫기(X) 없음 (정렬 선택 같은 목록 시트) */
  compact?: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({
  title,
  description,
  variant = "default",
  titleAlign = "start",
  compact = false,
  onClose,
  children,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div aria-hidden className="absolute inset-0 bg-black/40" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-[500px] flex-col overflow-hidden rounded-t-[20px] bg-white"
      >
        <header
          className={cn(
            "relative shrink-0 px-5",
            compact ? "pt-3 pb-1" : "pt-6 pb-4",
            variant === "primary" && "bg-primary text-white",
            titleAlign === "center" && "text-center",
          )}
        >
          <h2 id={titleId} className={compact ? "text-[13px] font-medium" : "text-lg font-bold"}>
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mt-1 text-xs",
                variant === "primary" ? "text-white/90" : "text-ink/70",
              )}
            >
              {description}
            </p>
          )}
          {!compact && (
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="absolute top-6 right-4 p-1"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </header>

        <div
          className={cn(
            "overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+20px)]",
            !compact && "px-5",
          )}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
