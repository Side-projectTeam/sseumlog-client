import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // 네트워크가 끊겨도 내비게이션/Server Action을 보류했다가 복구 시 재시도
    useOffline: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // 백엔드에 CORS 설정이 없어서 같은 origin의 /api/* 로 받아 서버에서 전달한다.
  async rewrites() {
    if (!process.env.API_URL) return [];
    return [{ source: "/api/:path*", destination: `${process.env.API_URL}/api/:path*` }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
