import { SpendingScreen } from "./_components/spending-screen";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소비 | 쓸로그",
};

export default function SpendingPage() {
  return <SpendingScreen />;
}
