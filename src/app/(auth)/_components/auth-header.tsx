import Link from "next/link";

import { ChevronLeftIcon } from "@/components/icons/chevron-icons";

type Props = {
  title: string;
} & ({ backHref: string; onBack?: never } | { onBack: () => void; backHref?: never });

export function AuthHeader({ title, backHref, onBack }: Props) {
  const icon = <ChevronLeftIcon className="size-5" />;

  return (
    <header className="flex h-[60px] items-center">
      {backHref ? (
        <Link href={backHref} aria-label="뒤로 가기" className="-ml-1 p-1">
          {icon}
        </Link>
      ) : (
        <button type="button" aria-label="뒤로 가기" onClick={onBack} className="-ml-1 p-1">
          {icon}
        </button>
      )}
      <h1 className="ml-2 text-base font-semibold">{title}</h1>
    </header>
  );
}
