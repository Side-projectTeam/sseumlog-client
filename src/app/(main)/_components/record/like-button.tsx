"use client";

import { useToggleLike } from "@/features/record/queries";
import { cn } from "@/lib/cn";

type Props = {
  id: number;
  liked: boolean;
  className?: string;
};

export function LikeButton({ id, liked, className }: Props) {
  const toggleMutation = useToggleLike();
  // 응답을 기다리지 않고 바로 바뀐 모양을 보여준다.
  const shown = toggleMutation.isPending ? toggleMutation.variables.liked : liked;

  return (
    <button
      type="button"
      aria-label={shown ? "좋아요 취소" : "좋아요"}
      aria-pressed={shown}
      onClick={() => toggleMutation.mutate({ id, liked: !shown })}
      className={cn("p-1 text-white", className)}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-full drop-shadow-[0_0_2px_rgba(0,0,0,0.4)]"
      >
        <path
          d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"
          fill={shown ? "#ff4d6d" : "none"}
          stroke={shown ? "#ff4d6d" : "currentColor"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
