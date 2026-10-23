# sseumlog-client

## 기술 스택

- Next.js (App Router) / React / TypeScript
- Tailwind CSS
- TanStack Query / axios / zustand
- ESLint / Prettier
- PWA (Web App Manifest + Service Worker)

## 시작하기

패키지 매니저는 **pnpm**만 사용합니다.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

| 명령어              | 설명               |
| ------------------- | ------------------ |
| `pnpm dev`          | 개발 서버 실행     |
| `pnpm build`        | 프로덕션 빌드      |
| `pnpm start`        | 프로덕션 서버 실행 |
| `pnpm lint`         | ESLint 검사        |
| `pnpm lint:fix`     | ESLint 자동 수정   |
| `pnpm format`       | Prettier 포맷팅    |
| `pnpm format:check` | 포맷 검사          |
| `pnpm type-check`   | 타입 검사          |

## 폴더 구조

```
src/
├── app/                  # 라우트, 레이아웃, manifest
├── components/
│   ├── providers/        # 전역 Provider (TanStack Query 등)
│   └── pwa/              # 서비스 워커 등록, 오프라인 배너
├── lib/
│   ├── api/              # axios 인스턴스
│   ├── query-client.ts
│   └── service-worker.js
└── stores/               # zustand 스토어 (필요 시 생성)
public/icons/             # PWA 아이콘
```
