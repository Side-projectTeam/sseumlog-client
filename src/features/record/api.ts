import { CATEGORIES } from "@/features/home/categories";
import type { CategoryId } from "@/features/home/types";

import type { SpendingRecord, SpendingRecordInput } from "./types";

// TODO: 서버에 소비 기록 API가 추가되면 연결.
// 지금은 메모리에 들고 있어서 새로고침하면 처음 상태로 돌아간다.
let records: SpendingRecord[] = [
  {
    id: 1,
    imageUrl: null,
    price: 16_000,
    purchasedAt: "2026-10-07",
    category: "study",
    satisfaction: "VERY_SATISFIED",
    emotion: "JOY",
    memo: "이번 달 가장 잘 산 책! 내용이 너무 좋다",
    liked: false,
    place: "청주시 강서동 영풍문고",
  },
  {
    id: 2,
    imageUrl: null,
    price: 3_000,
    purchasedAt: "2026-10-12",
    category: "cafe",
    satisfaction: "SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "청주시 강서동 스기",
  },
  {
    id: 3,
    imageUrl: null,
    price: 8_000,
    purchasedAt: "2026-10-12",
    category: "household",
    satisfaction: "NORMAL",
    emotion: "COMFORT",
    memo: "",
    liked: false,
    place: "청주시 강서동 판도",
  },
  {
    id: 4,
    imageUrl: null,
    price: 12_000,
    purchasedAt: "2026-10-11",
    category: "food",
    satisfaction: "VERY_SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "평택시 동기비 쭈꾸미",
  },
  {
    id: 5,
    imageUrl: null,
    price: 16_000,
    purchasedAt: "2026-10-10",
    category: "food",
    satisfaction: "VERY_SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "청주시 제주삼겹",
  },
  {
    id: 6,
    imageUrl: null,
    price: 12_000,
    purchasedAt: "2026-10-09",
    category: "hobby",
    satisfaction: "SATISFIED",
    emotion: "EXCITED",
    memo: "",
    liked: false,
    place: "서울시 정한마리",
  },
  {
    id: 7,
    imageUrl: null,
    price: 24_000,
    purchasedAt: "2026-10-15",
    category: "food",
    satisfaction: "VERY_SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "청주시 복대동 국밥집",
  },
  {
    id: 8,
    imageUrl: null,
    price: 45_000,
    purchasedAt: "2026-10-16",
    category: "fashion",
    satisfaction: "SATISFIED",
    emotion: "EXCITED",
    memo: "가을 니트 득템",
    liked: false,
    place: "청주시 성안길 무신사",
  },
  {
    id: 9,
    imageUrl: null,
    price: 18_000,
    purchasedAt: "2026-10-17",
    category: "beauty",
    satisfaction: "SATISFIED",
    emotion: "PROUD",
    memo: "",
    liked: false,
    place: "청주시 올리브영",
  },
  {
    id: 10,
    imageUrl: null,
    price: 9_000,
    purchasedAt: "2026-10-18",
    category: "food",
    satisfaction: "VERY_SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "청주시 분식집",
  },
  {
    id: 11,
    imageUrl: null,
    price: 32_000,
    purchasedAt: "2026-10-19",
    category: "household",
    satisfaction: "DISAPPOINTED",
    emotion: "REGRET",
    memo: "생각보다 쓸 일이 없었다",
    liked: false,
    place: "청주시 다이소",
  },
  {
    id: 12,
    imageUrl: null,
    price: 6_500,
    purchasedAt: "2026-10-20",
    category: "cafe",
    satisfaction: "NORMAL",
    emotion: "COMFORT",
    memo: "",
    liked: false,
    place: "청주시 스타벅스",
  },
  {
    id: 13,
    imageUrl: null,
    price: 15_000,
    purchasedAt: "2026-10-21",
    category: "etc",
    satisfaction: "NORMAL",
    emotion: "BURDEN",
    memo: "경조사 선물",
    liked: false,
    place: "청주시 편의점",
  },
  {
    id: 14,
    imageUrl: null,
    price: 21_000,
    purchasedAt: "2026-10-22",
    category: "food",
    satisfaction: "SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "청주시 쌀국수",
  },
  {
    id: 15,
    imageUrl: null,
    price: 30_000,
    purchasedAt: "2026-09-05",
    category: "food",
    satisfaction: "SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "청주시 고깃집",
  },
  {
    id: 16,
    imageUrl: null,
    price: 12_000,
    purchasedAt: "2026-09-08",
    category: "food",
    satisfaction: "NORMAL",
    emotion: "COMFORT",
    memo: "",
    liked: false,
    place: "청주시 김밥천국",
  },
  {
    id: 17,
    imageUrl: null,
    price: 8_000,
    purchasedAt: "2026-09-12",
    category: "cafe",
    satisfaction: "SATISFIED",
    emotion: "JOY",
    memo: "",
    liked: false,
    place: "청주시 메가커피",
  },
  {
    id: 18,
    imageUrl: null,
    price: 40_000,
    purchasedAt: "2026-09-15",
    category: "fashion",
    satisfaction: "DISAPPOINTED",
    emotion: "REGRET",
    memo: "",
    liked: false,
    place: "청주시 지오다노",
  },
  {
    id: 19,
    imageUrl: null,
    price: 14_000,
    purchasedAt: "2026-09-20",
    category: "study",
    satisfaction: "SATISFIED",
    emotion: "PROUD",
    memo: "",
    liked: false,
    place: "청주시 교보문고",
  },
  {
    id: 20,
    imageUrl: null,
    price: 25_000,
    purchasedAt: "2026-09-25",
    category: "household",
    satisfaction: "NORMAL",
    emotion: "BURDEN",
    memo: "",
    liked: false,
    place: "청주시 이마트",
  },
];

let nextId = records.length + 1;

const delay = () => new Promise((resolve) => setTimeout(resolve, 200));

export type RecordFilter = {
  category?: CategoryId;
  /** YYYY-MM. 없으면 전체 기간 */
  yearMonth?: string;
};

export async function getRecords({ category, yearMonth }: RecordFilter = {}) {
  await delay();
  return records
    .filter((r) => !category || r.category === category)
    .filter((r) => !yearMonth || r.purchasedAt.startsWith(yearMonth))
    .toSorted((a, b) => b.purchasedAt.localeCompare(a.purchasedAt) || b.id - a.id);
}

export async function getRecord(id: number) {
  await delay();
  const record = records.find((r) => r.id === id);
  if (!record) throw new Error("소비 기록을 찾을 수 없어요.");
  return record;
}

export async function createRecord(input: SpendingRecordInput) {
  await delay();
  const record: SpendingRecord = { ...input, id: nextId++, liked: false };
  records = [...records, record];
  return record;
}

export async function updateRecord(id: number, input: SpendingRecordInput) {
  await delay();
  const record = await getRecord(id);
  const updated = { ...record, ...input };
  records = records.map((r) => (r.id === id ? updated : r));
  return updated;
}

export async function setRecordLiked(id: number, liked: boolean) {
  await delay();
  records = records.map((r) => (r.id === id ? { ...r, liked } : r));
}

export async function deleteRecord(id: number) {
  await delay();
  records = records.filter((r) => r.id !== id);
}

/** 기록이 하나라도 있는 카테고리 (선반에 올라갈 순서대로) */
export async function getRecordCategories() {
  return (Object.keys(CATEGORIES) as CategoryId[]).filter((id) =>
    records.some((r) => r.category === id),
  );
}
