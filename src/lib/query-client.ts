import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 직후 클라이언트에서 바로 refetch 되지 않도록 staleTime을 0보다 크게 둔다.
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  // 서버: 요청마다 새 QueryClient (사용자 간 캐시 공유 방지)
  if (isServer) return makeQueryClient();
  // 브라우저: 싱글턴 유지 (Suspense로 인한 재생성 방지)
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
