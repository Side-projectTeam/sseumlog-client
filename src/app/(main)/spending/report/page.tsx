import { ReportScreen } from "./_components/report-screen";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소비 분석 | 쓸로그",
};

export default function SpendingReportPage() {
  return <ReportScreen />;
}
