"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChartIcon, HomeIcon, UserIcon } from "@/components/icons/nav-icons";
import { cn } from "@/lib/cn";

// TODO: /spending, /my 는 시안이 나올 때까지 준비 중 화면
const tabs = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/spending", label: "소비", Icon: ChartIcon },
  { href: "/my", label: "마이", Icon: UserIcon },
] as const;

// 하단 탭 둥근 모서리 뒤로 보이는 색을 화면 배경에 맞춘다.
// (cacheComponents가 이전 화면을 숨긴 채 DOM에 남겨서 CSS :has()로는 판단할 수 없다)
function cornerBackground(pathname: string) {
  if (pathname === "/") return "bg-room";
  if (pathname === "/spending/report" || pathname === "/spending/budget") return "bg-field";
  return "bg-white";
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴" className={cn("sticky bottom-0 z-10", cornerBackground(pathname))}>
      <div className="rounded-t-[20px] bg-white pb-[env(safe-area-inset-bottom)]">
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
      </div>
    </nav>
  );
}
