import { ProfileScreen } from "./_components/profile-screen";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원정보 수정 | 쓸로그",
};

export default function ProfilePage() {
  return <ProfileScreen />;
}
