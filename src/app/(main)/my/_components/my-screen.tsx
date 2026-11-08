"use client";

import Link from "next/link";
import { useState } from "react";

import { useMyProfile } from "@/features/user/queries";

import { FeedbackSheet } from "./feedback-sheet";
import { MyHeader } from "./my-header";
import { ProfileAvatar } from "./profile-avatar";

export function MyScreen() {
  const { data: profile } = useMyProfile();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // TODO: 개인정보 처리 방침 페이지가 정해지면 연결
  const menus = [
    { label: "개인정보 처리 방침", onClick: undefined },
    { label: "피드백 보내기", onClick: () => setFeedbackOpen(true) },
  ];

  return (
    <main className="flex flex-1 flex-col bg-field">
      <MyHeader backHref="/" title="마이" />

      <div className="flex flex-col gap-3 px-4 pt-5">
        <section
          aria-label="내 정보"
          className="relative flex h-[100px] items-center gap-5 rounded-xl bg-primary px-4 text-white"
        >
          {profile ? (
            <>
              <ProfileAvatar imageUrl={profile.imageUrl} size={68} />
              <p className="text-xl font-bold">{profile.nickname}</p>
            </>
          ) : (
            <span aria-hidden className="size-[68px] animate-pulse rounded-full bg-white/30" />
          )}
          <Link
            href="/my/verify-password"
            className="absolute right-4 bottom-3 flex items-center text-xs"
          >
            회원 정보 관리
            <span aria-hidden className="ml-1">
              &gt;
            </span>
          </Link>
        </section>

        <ul className="flex flex-col gap-3">
          {menus.map(({ label, onClick }) => (
            <li key={label}>
              <button
                type="button"
                onClick={onClick}
                className="flex h-[52px] w-full items-center justify-between rounded-lg bg-white px-4 text-left text-sm"
              >
                {label}
                <span aria-hidden className="text-muted">
                  &gt;
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {feedbackOpen && <FeedbackSheet onClose={() => setFeedbackOpen(false)} />}
    </main>
  );
}
