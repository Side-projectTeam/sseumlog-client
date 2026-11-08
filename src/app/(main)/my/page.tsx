import { MyScreen } from "./_components/my-screen";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이 | 쓸로그",
};

export default function MyPage() {
  return <MyScreen />;
}
