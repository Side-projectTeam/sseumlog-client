"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChartIcon, HomeIcon, UserIcon } from "@/components/icons/nav-icons";
import { cn } from "@/lib/cn";

// TODO: /spending, /my 화면이 생기면 연결
const tabs = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/spending", label: "소비", Icon: ChartIcon },
  { href: "/my", label: "마이", Icon: UserIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-10 rounded-t-[20px] bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-[60px] items-center">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 text-[11px]",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="size-6" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
