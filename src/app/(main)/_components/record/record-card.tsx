import { emotionLabel, satisfactionLabel } from "@/features/record/options";
import type { SpendingRecord } from "@/features/record/types";
import { cn } from "@/lib/cn";

import { formatPrice, formatShortDate } from "./format";
import { LikeButton } from "./like-button";
import { RecordImage } from "./record-image";

type Props = {
  record: SpendingRecord;
  onClick: () => void;
  /** 사진 왼쪽 위에 구매일 표시 */
  showDate?: boolean;
  /** 사진 오른쪽 위에 좋아요 버튼 표시 */
  showLike?: boolean;
};

export function RecordCard({ record, onClick, showDate, showLike }: Props) {
  return (
    // 좋아요 버튼을 카드 버튼 안에 넣을 수 없어서 겹쳐 둔다.
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={`${record.place || "거래처 없음"} ${formatPrice(record.price)} 상세 보기`}
        className="flex w-full flex-col rounded-lg p-1 text-left ring-2 ring-[#e3e6fd] ring-inset"
      >
        <div className="relative w-full">
          <RecordImage
            imageUrl={record.imageUrl}
            category={record.category}
            sizes="120px"
            className="aspect-square w-full rounded-md"
          />
          {showDate && (
            <span className="absolute top-1 left-1 rounded-sm bg-black/45 px-1 text-[9px] font-semibold text-white">
              {formatShortDate(record.purchasedAt)}
            </span>
          )}
        </div>
        <p className="mt-1 w-full truncate text-[10px] font-medium">
          {record.place || "거래처 없음"}
        </p>
        <div className="mt-0.5 flex gap-0.5">
          {[satisfactionLabel(record.satisfaction), emotionLabel(record.emotion)].map((label) => (
            <span
              key={label}
              className="rounded-full px-1 text-[8px] whitespace-nowrap text-ink/70 ring-1 ring-ink/20 ring-inset"
            >
              {label}
            </span>
          ))}
        </div>
        <p className="mt-0.5 w-full text-right text-[11px] font-semibold text-primary">
          {formatPrice(record.price)}
        </p>
      </button>
      {showLike && (
        <LikeButton
          id={record.id}
          liked={record.liked}
          // 사진이 없으면 배경이 밝아서 흰 하트가 안 보인다.
          className={cn("absolute top-1.5 right-1.5 size-6", !record.imageUrl && "text-ink/40")}
        />
      )}
    </div>
  );
}
