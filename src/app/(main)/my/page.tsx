import { ComingSoon } from "../_components/coming-soon";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이 | 쓸로그",
};

// TODO: 마이 화면 시안이 나오면 구현
export default function MyPage() {
  return <ComingSoon title="마이" />;
}
