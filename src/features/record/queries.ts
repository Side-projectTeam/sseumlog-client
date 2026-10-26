import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createRecord,
  deleteRecord,
  getRecord,
  getRecords,
  setRecordLiked,
  updateRecord,
  type RecordFilter,
} from "./api";

import type { SpendingRecordInput } from "./types";

export const recordKeys = {
  all: ["records"] as const,
  list: (filter: RecordFilter) => ["records", "list", filter] as const,
  detail: (id: number) => ["records", "detail", id] as const,
};

export function useRecords(filter: RecordFilter, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: recordKeys.list(filter),
    queryFn: () => getRecords(filter),
    ...options,
  });
}

export function useRecord(id: number) {
  return useQuery({ queryKey: recordKeys.detail(id), queryFn: () => getRecord(id) });
}

// 기록이 바뀌면 목록, 홈 선반(카테고리), 소비 탭 요약을 다시 불러온다.
function useInvalidateRecords() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: recordKeys.all }),
      queryClient.invalidateQueries({ queryKey: ["home"] }),
      queryClient.invalidateQueries({ queryKey: ["spending-summary"] }),
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

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) => setRecordLiked(id, liked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recordKeys.all }),
  });
}

export function useDeleteRecord() {
  const invalidate = useInvalidateRecords();
  return useMutation({ mutationFn: deleteRecord, onSuccess: invalidate });
}
