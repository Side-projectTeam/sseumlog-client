import Image from "next/image";

import { cn } from "@/lib/cn";

type Props = {
  imageUrl: string | null;
  size: number;
  className?: string;
};

/** 프로필 사진. 사진이 없으면 회색 원만 보여준다. */
export function ProfileAvatar({ imageUrl, size, className }: Props) {
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-full bg-[#d9d9e8]", className)}
      style={{ width: size, height: size }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={`${size}px`}
          // 방금 고른 사진(blob:)과 서버 사진(호스트가 정해지지 않음)은 최적화 없이 쓴다.
          unoptimized={!imageUrl.startsWith("/")}
          className="object-cover"
        />
      )}
    </span>
  );
}
