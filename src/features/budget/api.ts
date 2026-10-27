import type { Budget } from "./types";

// TODO: 서버에 예산 API가 추가되면 연결. 지금은 메모리에 달별로 들고 있는다.
const budgets = new Map<string, Budget>();

const defaultBudget = (): Budget => ({
  income: 3_000_400,
  plannedExpense: 1_000_000,
  targetBudget: 1_000_000,
  targetSaving: 1_000_000,
  resolution: "나에게 불필요한 소비를 줄이자",
  categories: {
    study: 50_000,
    cafe: 100_000,
    food: 250_000,
    fashion: 150_000,
    beauty: 100_000,
    household: 150_000,
    hobby: 100_000,
    etc: 100_000,
  },
});

const delay = () => new Promise((resolve) => setTimeout(resolve, 200));

export async function getBudget(yearMonth: string) {
  await delay();
  return budgets.get(yearMonth) ?? defaultBudget();
}

export async function saveBudget(yearMonth: string, budget: Budget) {
  await delay();
  budgets.set(yearMonth, budget);
  return budget;
}
