import type { Satisfaction, SpendingRecord } from "@/features/record/types";

export type RecordSort = "recent" | "priceAsc" | "priceDesc" | "satisfaction" | "unplanned";

export const RECORD_SORTS: { value: RecordSort; label: string }[] = [
  { value: "recent", label: "최근 등록 순" },
  { value: "priceAsc", label: "낮은 금액순" },
  { value: "priceDesc", label: "높은 금액순" },
  { value: "satisfaction", label: "만족도 높은순" },
  { value: "unplanned", label: "계획 외 소비순" },
];

const satisfactionRank: Record<Satisfaction, number> = {
  VERY_SATISFIED: 0,
  SATISFIED: 1,
  NORMAL: 2,
  DISAPPOINTED: 3,
};

export function sortRecords(records: SpendingRecord[], sort: RecordSort) {
  const byRecent = (a: SpendingRecord, b: SpendingRecord) => b.id - a.id;
  switch (sort) {
    case "priceAsc":
      return records.toSorted((a, b) => a.price - b.price || byRecent(a, b));
    case "priceDesc":
      return records.toSorted((a, b) => b.price - a.price || byRecent(a, b));
    case "satisfaction":
      return records.toSorted(
        (a, b) =>
          satisfactionRank[a.satisfaction] - satisfactionRank[b.satisfaction] || byRecent(a, b),
      );
    // TODO: 기록에 '계획 외 소비' 여부가 생기면 정렬 기준 추가. 지금은 최근 등록 순과 같다.
    case "unplanned":
    case "recent":
      return records.toSorted(byRecent);
  }
}
