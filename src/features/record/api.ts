import { CATEGORIES } from "@/features/home/categories";
import type { CategoryId } from "@/features/home/types";
import { apiClient, type ApiResponse } from "@/lib/api/client";
import {
  fromServerCategory,
  fromServerEmotion,
  fromServerSatisfaction,
  SERVER_CATEGORY,
  SERVER_EMOTION,
  SERVER_SATISFACTION,
  splitYearMonth,
  type ServerCategory,
  type ServerEmotion,
  type ServerSatisfaction,
} from "@/lib/api/enums";

import { useLikeStore } from "./likes";

import type { SpendingRecord, SpendingRecordInput } from "./types";

type ExpenseResponse = {
  id: number;
  imageUrl: string | null;
  price: number;
  /** ISO date-time */
  purchasedAt: string;
  category: ServerCategory;
  satisfaction: ServerSatisfaction;
  emotion: ServerEmotion;
  memo: string | null;
  merchant: string | null;
};

type ExpenseRequest = {
  price: number;
  purchasedAt: string;
  category: ServerCategory;
  satisfaction: ServerSatisfaction;
  emotion: ServerEmotion;
  memo: string;
  merchant: string;
};

function toRecord(expense: ExpenseResponse): SpendingRecord {
  return {
    id: expense.id,
    imageUrl: expense.imageUrl || null,
    price: expense.price,
    purchasedAt: expense.purchasedAt.slice(0, 10),
    category: fromServerCategory[expense.category],
    satisfaction: fromServerSatisfaction[expense.satisfaction],
    emotion: fromServerEmotion[expense.emotion],
    memo: expense.memo ?? "",
    place: expense.merchant ?? "",
    liked: useLikeStore.getState().likedIds.includes(expense.id),
  };
}

// 소비 등록·수정은 multipart. request는 JSON 파트, file은 새로 고른 사진일 때만 보낸다.
async function toFormData(input: SpendingRecordInput) {
  const request: ExpenseRequest = {
    price: input.price,
    purchasedAt: `${input.purchasedAt}T00:00:00`,
    category: SERVER_CATEGORY[input.category],
    satisfaction: SERVER_SATISFACTION[input.satisfaction],
    emotion: SERVER_EMOTION[input.emotion],
    memo: input.memo,
    merchant: input.place,
  };
  const form = new FormData();
  form.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  // 방금 고른 사진은 blob: 주소로 들고 있다가 여기서 파일로 바꾼다.
  if (input.imageUrl?.startsWith("blob:")) {
    const blob = await fetch(input.imageUrl).then((res) => res.blob());
    form.append("file", blob, `image.${blob.type.split("/")[1] || "jpg"}`);
  }
  return form;
}

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export type RecordFilter = {
  category?: CategoryId;
  /** YYYY-MM. 없으면 전체 기간 */
  yearMonth?: string;
};

export async function getRecords({ category, yearMonth }: RecordFilter = {}) {
  const { data } = await apiClient.get<ApiResponse<ExpenseResponse[]>>("/api/expenses", {
    params: yearMonth ? splitYearMonth(yearMonth) : undefined,
  });
  return data.data
    .map(toRecord)
    .filter((r) => !category || r.category === category)
    .toSorted((a, b) => b.purchasedAt.localeCompare(a.purchasedAt) || b.id - a.id);
}

export async function getRecord(id: number) {
  const { data } = await apiClient.get<ApiResponse<ExpenseResponse>>(`/api/expenses/${id}`);
  return toRecord(data.data);
}

export async function createRecord(input: SpendingRecordInput) {
  const { data } = await apiClient.post<ApiResponse<ExpenseResponse>>(
    "/api/expenses",
    await toFormData(input),
    multipart,
  );
  return toRecord(data.data);
}

export async function updateRecord(id: number, input: SpendingRecordInput) {
  const { data } = await apiClient.put<ApiResponse<ExpenseResponse>>(
    `/api/expenses/${id}`,
    await toFormData(input),
    multipart,
  );
  return toRecord(data.data);
}

export async function setRecordLiked(id: number, liked: boolean) {
  useLikeStore.getState().setLiked(id, liked);
}

export async function deleteRecord(id: number) {
  await apiClient.delete(`/api/expenses/${id}`);
  useLikeStore.getState().setLiked(id, false);
}

/** 기록이 하나라도 있는 카테고리 (선반에 올라갈 순서대로) */
export async function getRecordCategories() {
  const records = await getRecords();
  return (Object.keys(CATEGORIES) as CategoryId[]).filter((id) =>
    records.some((r) => r.category === id),
  );
}
