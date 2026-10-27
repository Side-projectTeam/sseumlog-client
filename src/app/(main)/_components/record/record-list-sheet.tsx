import { BottomSheet } from "@/components/ui/bottom-sheet";
import type { CategoryId } from "@/features/home/types";
import { useRecords } from "@/features/record/queries";

import { formatPrice } from "./format";
import { RecordCard } from "./record-card";

type Props = {
  nickname: string;
  /** 없으면 전체 기록 */
  category?: CategoryId;
  onCreate: () => void;
  onSelect: (id: number) => void;
  onClose: () => void;
};

export function RecordListSheet({ nickname, category, onCreate, onSelect, onClose }: Props) {
  const { data: records, isPending } = useRecords({ category });
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
            <RecordCard record={record} onClick={() => onSelect(record.id)} showDate />
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
