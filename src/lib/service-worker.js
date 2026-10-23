/// <reference lib="webworker" />

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 푸시 알림, 오프라인 캐싱 등은 필요할 때 여기에 추가한다.
// (전체 오프라인 캐싱이 필요해지면 Serwist 도입을 고려)
