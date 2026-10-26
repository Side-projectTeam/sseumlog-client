import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CategoryId } from "@/features/home/types";

import { createRecord, deleteRecord, getRecord, getRecords, updateRecord } from "./api";

import type { SpendingRecordInput } from "./types";

export const recordKeys = {
  all: ["records"] as const,
  list: (category?: CategoryId) => ["records", "list", category ?? "all"] as const,
  detail: (id: number) => ["records", "detail", id] as const,
};

export function useRecords(category?: CategoryId) {
  return useQuery({ queryKey: recordKeys.list(category), queryFn: () => getRecords(category) });
}

export function useRecord(id: number) {
  return useQuery({ queryKey: recordKeys.detail(id), queryFn: () => getRecord(id) });
}

// 기록이 바뀌면 목록과 홈 선반(카테고리)을 다시 불러온다.
function useInvalidateRecords() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: recordKeys.all }),
      queryClient.invalidateQueries({ queryKey: ["home"] }),
    ]);
}

export function useCreateRecord() {
  const invalidate = useInvalidateRecords();
  return useMutation({ mutationFn: createRecord, onSuccess: invalidate });
}

export function useUpdateRecord(id: number) {
  const invalidate = useInvalidateRecords();
  return useMutation({
    mutationFn: (input: SpendingRecordInput) => updateRecord(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteRecord() {
  const invalidate = useInvalidateRecords();
  return useMutation({ mutationFn: deleteRecord, onSuccess: invalidate });
}
