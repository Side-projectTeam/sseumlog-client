import Image from "next/image";

import { CATEGORIES } from "@/features/home/categories";
import type { CategoryId } from "@/features/home/types";
import { cn } from "@/lib/cn";

type Props = {
  imageUrl: string | null;
  category: CategoryId;
  sizes: string;
  className?: string;
};

/** 기록 사진. 사진이 없으면 카테고리 아이콘을 대신 보여준다. */
export function RecordImage({ imageUrl, category, sizes, className }: Props) {
  return (
    <div className={cn("relative overflow-hidden bg-[#e3e6fd]", className)}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={sizes}
          // 방금 고른 사진(blob: 주소)은 이미지 최적화를 거칠 수 없다.
          unoptimized={imageUrl.startsWith("blob:")}
          className="object-cover"
        />
      ) : (
        <Image
          src={CATEGORIES[category].image}
          alt=""
          width={106}
          height={92}
          className="absolute top-1/2 left-1/2 h-1/2 w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      )}
    </div>
  );
}
