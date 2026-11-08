import Link from "next/link";

import { ChevronLeftIcon } from "@/components/icons/chevron-icons";

type Props = {
  backHref: string;
  title?: string;
};

export function MyHeader({ backHref, title }: Props) {
  return (
    <header className="relative z-[1] flex h-[50px] items-center bg-white px-4 pt-[env(safe-area-inset-top)] shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
      <Link href={backHref} aria-label="뒤로 가기" className="-ml-1 p-1">
        <ChevronLeftIcon className="size-6" />
      </Link>
      {title && <h1 className="ml-1 text-lg font-semibold">{title}</h1>}
    </header>
  );
}
