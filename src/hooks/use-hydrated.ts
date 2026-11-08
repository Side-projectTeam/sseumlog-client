import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** 브라우저에서 hydration이 끝났으면 true. localStorage 같은 브라우저 값을 읽기 전에 쓴다. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
