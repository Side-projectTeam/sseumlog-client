import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getBudget, saveBudget } from "./api";

import type { Budget } from "./types";

export const budgetKeys = {
  month: (yearMonth: string) => ["budget", yearMonth] as const,
};

export function useBudget(yearMonth: string | undefined) {
  return useQuery({
    queryKey: budgetKeys.month(yearMonth ?? ""),
    queryFn: () => getBudget(yearMonth!),
    enabled: !!yearMonth,
  });
}

export function useSaveBudget(yearMonth: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (budget: Budget) => saveBudget(yearMonth, budget),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["budget"] }),
        queryClient.invalidateQueries({ queryKey: ["spending-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["report"] }),
        queryClient.invalidateQueries({ queryKey: ["home"] }),
      ]),
  });
}
