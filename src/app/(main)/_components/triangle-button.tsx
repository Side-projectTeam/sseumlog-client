type Props = { direction: "prev" | "next" } & React.ComponentProps<"button">;

/** 월 이동용 ◀ ▶ 버튼 */
export function TriangleButton({ direction, ...props }: Props) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "이전 달" : "다음 달"}
      className="p-1 transition-opacity disabled:opacity-40"
      {...props}
    >
      <svg viewBox="0 0 10 10" aria-hidden className="size-2.5">
        <path fill="currentColor" d={direction === "prev" ? "M8 1v8L1 5Z" : "M2 1v8l7-4Z"} />
      </svg>
    </button>
  );
}
