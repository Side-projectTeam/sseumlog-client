import Image from "next/image";

import { CATEGORIES } from "@/features/home/categories";
import { type CategoryId } from "@/features/home/types";
import { cn } from "@/lib/cn";

// 시안 기준 선반 3개에 3·3·2칸. 위 선반부터 왼쪽→오른쪽으로 채운다.
const SHELF_SLOTS = [3, 3, 2];

// 빈칸 뒤에 흐리게 비치는 그림. TODO: 디자인 에셋이 나오면 교체 (지금은 기존 카테고리 이미지를 재사용)
const ADD_SLOT_PREVIEWS = [
  "/images/categories/household.png",
  "/images/categories/hobby.png",
  "/images/categories/cafe.png",
];

type Slot = { type: "category"; id: CategoryId } | { type: "empty"; preview: string };

type Props = {
  categories: CategoryId[];
  onSelectCategory: (id: CategoryId) => void;
  onAdd: () => void;
};

export function CategoryShelves({ categories, onSelectCategory, onAdd }: Props) {
  let index = 0;
  let emptyIndex = 0;
  const shelves = SHELF_SLOTS.map((count) =>
    Array.from({ length: count }, (): Slot => {
      const id = categories[index++];
      return id
        ? { type: "category", id }
        : { type: "empty", preview: ADD_SLOT_PREVIEWS[emptyIndex++ % ADD_SLOT_PREVIEWS.length] };
    }),
  );

  return (
    <section aria-label="소비 카테고리" className="relative flex flex-1 flex-col">
      <div className="flex flex-col gap-[30px] px-5 pt-[30px]">
        {shelves.map((slots, i) => (
          <Shelf
            key={i}
            slots={slots}
            align={i === 0 ? "start" : "end"}
            onSelectCategory={onSelectCategory}
            onAdd={onAdd}
          />
        ))}
      </div>

      <Floor />
    </section>
  );
}

function Shelf({
  slots,
  align,
  onSelectCategory,
  onAdd,
}: { slots: Slot[]; align: "start" | "end" } & Pick<Props, "onSelectCategory" | "onAdd">) {
  return (
    <div className={cn("flex flex-col", align === "end" && "items-end")}>
      <ul className="relative z-[1] flex">
        {slots.map((slot, i) => (
          <li
            key={slot.type === "category" ? slot.id : `empty-${i}`}
            className="flex h-[70px] w-[77px] items-end justify-center"
          >
            {slot.type === "category" ? (
              <CategoryItem id={slot.id} onClick={() => onSelectCategory(slot.id)} />
            ) : (
              <AddSlot preview={slot.preview} onClick={onAdd} />
            )}
          </li>
        ))}
      </ul>
      <div
        aria-hidden
        className="-mt-1 h-[21px] rounded-md bg-shelf shadow-[0_10px_16px_-4px_rgba(93,94,247,0.25)] ring-1 ring-white/70 ring-inset"
        style={{ width: slots.length * 77 }}
      />
    </div>
  );
}

function CategoryItem({ id, onClick }: { id: CategoryId; onClick: () => void }) {
  const { name, image } = CATEGORIES[id];

  return (
    <button
      type="button"
      aria-label={`${name} 소비 기록 보기`}
      onClick={onClick}
      className="flex h-[60px] items-end"
    >
      <Image src={image} width={106} height={92} alt="" className="max-h-full w-auto" />
    </button>
  );
}

// Figma: 64×64, 배경 #FFFFFF 10%, + 선 3px Brand/Purple/Primary
function AddSlot({ preview, onClick }: { preview: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="소비방 꾸미기"
      onClick={onClick}
      className="relative mb-1 flex size-16 items-center justify-center overflow-hidden rounded-[14px] text-primary ring-1 ring-white/80 ring-inset"
    >
      <Image
        src={preview}
        width={106}
        height={92}
        alt=""
        className="absolute inset-0 size-full scale-125 object-cover opacity-80 blur-[7px]"
      />
      <span aria-hidden className="absolute inset-0 bg-white/10" />
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="relative size-5">
        <path
          d="M10 1.5v17M1.5 10h17"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function Floor() {
  return (
    <div aria-hidden className="relative mt-auto pt-[70px]">
      {/* TODO: 캐릭터 원본 에셋으로 교체 (시안 캡쳐에서 잘라낸 임시 이미지) */}
      <Image
        src="/images/home/pig.png"
        width={290}
        height={249}
        alt=""
        priority
        className="absolute bottom-[18px] left-[25px] z-[1] w-[157px]"
      />
      <div className="h-5 bg-shelf" />
      <div className="h-[54px] border-t border-[#d3d8f8] bg-floor" />
    </div>
  );
}
