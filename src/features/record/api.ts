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
    place: "서울시 정한마리",
  },
];

let nextId = records.length + 1;

const delay = () => new Promise((resolve) => setTimeout(resolve, 200));

export async function getRecords(category?: CategoryId) {
  await delay();
  return records
    .filter((r) => !category || r.category === category)
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
  const record = { ...input, id: nextId++ };
  records = [...records, record];
  return record;
}

export async function updateRecord(id: number, input: SpendingRecordInput) {
  await delay();
  const record = { ...input, id };
  records = records.map((r) => (r.id === id ? record : r));
  return record;
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
