import { BudgetScreen } from "./_components/budget-screen";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "예산 설정 | 쓸로그",
};

export default function BudgetPage() {
  return <BudgetScreen />;
}
