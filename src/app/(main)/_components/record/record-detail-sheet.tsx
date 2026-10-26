"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { CATEGORIES } from "@/features/home/categories";
import { emotionLabel, satisfactionLabel } from "@/features/record/options";
import { useDeleteRecord, useRecord } from "@/features/record/queries";
import type { SpendingRecord } from "@/features/record/types";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";

import { formatFullDate, formatPrice } from "./format";
import { LikeButton } from "./like-button";
import { RecordImage } from "./record-image";

type Props = {
  id: number;
  onEdit: () => void;
  onDeleted: () => void;
  onClose: () => void;
};

export function RecordDetailSheet({ id, onEdit, onDeleted, onClose }: Props) {
  const { data: record, isError, error } = useRecord(id);

  return (
    <BottomSheet title="소비 기록 상세" onClose={onClose}>
      {record ? (
        <RecordDetail record={record} onEdit={onEdit} onDeleted={onDeleted} />
      ) : isError ? (
        <p className="py-10 text-center text-sm text-muted">{getApiErrorMessage(error)}</p>
      ) : (
        <div aria-hidden className="h-[320px] animate-pulse rounded-lg bg-field" />
      )}
    </BottomSheet>
  );
}

function RecordDetail({
  record,
  onEdit,
  onDeleted,
}: {
  record: SpendingRecord;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const deleteMutation = useDeleteRecord();
  const categoryName = CATEGORIES[record.category].name;

  const share = async () => {
    const text = `${categoryName} ${formatPrice(record.price)}${record.memo ? ` - ${record.memo}` : ""}`;
    if (navigator.share) {
      await navigator.share({ title: "쓸로그 소비 기록", text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
      alert("소비 기록을 복사했어요.");
    }
  };

  const remove = () => {
    // TODO: 디자인에 삭제 확인 창이 나오면 교체
    if (!confirm("이 소비 기록을 삭제할까요?")) return;
    deleteMutation.mutate(record.id, { onSuccess: onDeleted });
  };

  return (
    <div className="flex flex-col pt-1">
      <div className="relative">
        <RecordImage
          imageUrl={record.imageUrl}
          category={record.category}
          sizes="500px"
          className="h-[148px] w-full rounded-lg"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-linear-to-b from-black/50 to-transparent px-3 pt-2.5 pb-4 text-white">
          <p className="flex min-w-0 items-center gap-1 text-[13px] font-semibold">
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
              />
            </svg>
            <span className="truncate">{record.place || "거래처 없음"}</span>
          </p>
          <LikeButton id={record.id} liked={record.liked} className="-mr-1 size-7" />
        </div>
      </div>

      <h3 className="mt-4 text-base font-bold">{record.place || categoryName}</h3>
      <p className="mt-1.5 flex items-center text-xs text-ink/70">
        {[formatFullDate(record.purchasedAt), categoryName].map((text) => (
          <span key={text} className="after:mx-2.5 after:text-[#d9d9d9] after:content-['|']">
            {text}
          </span>
        ))}
        <span className="font-semibold text-ink">{formatPrice(record.price)}</span>
      </p>

      {record.memo && (
        <p className="mt-3 rounded-lg bg-field px-3 py-2.5 text-[13px]">{record.memo}</p>
      )}

      <div className="mt-3 flex gap-1.5">
        {[satisfactionLabel(record.satisfaction), emotionLabel(record.emotion)].map((label) => (
          <span key={label} className="rounded-full bg-primary px-3 py-1 text-xs text-white">
            {label}
          </span>
        ))}
      </div>

      {deleteMutation.isError && (
        <p role="alert" className="mt-3 text-center text-sm text-danger">
          {getApiErrorMessage(deleteMutation.error)}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <ActionButton
          label="공유"
          onClick={share}
          icon="M12 4v11M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
        />
        <ActionButton
          label="수정"
          onClick={onEdit}
          icon="M14.5 5.5l4 4M5 19l1-4.5L15.5 5a1.4 1.4 0 0 1 2 0l1.5 1.5a1.4 1.4 0 0 1 0 2L9.5 18 5 19Z"
        />
        <ActionButton
          label="삭제"
          onClick={remove}
          disabled={deleteMutation.isPending}
          icon="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12M10.5 10.5v5M13.5 10.5v5"
        />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  className,
  ...props
}: { label: string; icon: string } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center gap-1 text-[11px] text-muted disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="flex size-9 items-center justify-center rounded-full ring-1 ring-[#d9d9d9] ring-inset">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-[18px] text-ink/70">
          <path
            d={icon}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </button>
  );
}
