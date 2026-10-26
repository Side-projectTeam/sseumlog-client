import { BottomSheet } from "@/components/ui/bottom-sheet";
import type { CategoryId } from "@/features/home/types";
import { emotionLabel, satisfactionLabel } from "@/features/record/options";
import { useRecords } from "@/features/record/queries";
import type { SpendingRecord } from "@/features/record/types";

import { formatPrice, formatShortDate } from "./format";
import { RecordImage } from "./record-image";

type Props = {
  nickname: string;
  /** 없으면 전체 기록 */
  category?: CategoryId;
  onCreate: () => void;
  onSelect: (id: number) => void;
  onClose: () => void;
};

export function RecordListSheet({ nickname, category, onCreate, onSelect, onClose }: Props) {
  const { data: records, isPending } = useRecords(category);
  const total = records?.reduce((sum, r) => sum + r.price, 0) ?? 0;

  return (
    <BottomSheet
      variant="primary"
      title={`총 소비 금액: ${formatPrice(total)}`}
      description={`${nickname}님의 소비를 모아봤어요.`}
      onClose={onClose}
    >
      <ul className="grid min-h-[50dvh] grid-cols-3 content-start gap-2 pt-4">
        <li>
          <button
            type="button"
            aria-label="새 소비 기록 등록하기"
            onClick={onCreate}
            className="flex h-full min-h-[140px] w-full items-center justify-center rounded-lg bg-[#eef0fe] text-primary ring-1 ring-primary/20 ring-inset"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-7">
              <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </li>
        {isPending &&
          Array.from({ length: 5 }, (_, i) => (
            <li key={i} aria-hidden className="aspect-[3/4] animate-pulse rounded-lg bg-field" />
          ))}
        {records?.map((record) => (
          <li key={record.id}>
            <RecordCard record={record} onClick={() => onSelect(record.id)} />
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}

function RecordCard({ record, onClick }: { record: SpendingRecord; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col rounded-lg p-1 text-left ring-1 ring-primary/25 ring-inset"
    >
      <div className="relative">
        <RecordImage
          imageUrl={record.imageUrl}
          category={record.category}
          sizes="120px"
          className="aspect-square w-full rounded-md"
        />
        <span className="absolute top-1 left-1 rounded-sm bg-black/45 px-1 text-[9px] font-semibold text-white">
          {formatShortDate(record.purchasedAt)}
        </span>
      </div>
      <p className="mt-1 truncate text-[10px]">{record.place || "거래처 없음"}</p>
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
      <p className="mt-0.5 text-right text-[10px] font-semibold text-primary">
        {formatPrice(record.price)}
      </p>
    </button>
  );
}
