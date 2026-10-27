import { BottomSheet } from "@/components/ui/bottom-sheet";
import { RECORD_SORTS, type RecordSort } from "@/features/spending/sort";
import { cn } from "@/lib/cn";

type Props = {
  value: RecordSort;
  onChange: (sort: RecordSort) => void;
  onClose: () => void;
};

export function SortSheet({ value, onChange, onClose }: Props) {
  return (
    <BottomSheet title="정렬" titleAlign="center" compact onClose={onClose}>
      <ul role="radiogroup" aria-label="정렬 기준" className="pt-2">
        {RECORD_SORTS.map((sort) => {
          const selected = sort.value === value;
          return (
            <li key={sort.value}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  onChange(sort.value);
                  onClose();
                }}
                className={cn(
                  "flex h-[50px] w-full items-center justify-between px-4 text-sm",
                  selected ? "font-semibold" : "text-ink/80",
                )}
              >
                {sort.label}
                {selected && (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
                    <path
                      d="m5 12.5 4.5 4.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="mt-1 h-[50px] w-full border-t border-[#e5e5e5] text-[15px] font-bold"
      >
        닫기
      </button>
    </BottomSheet>
  );
}
