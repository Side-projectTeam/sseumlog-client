import localFont from "next/font/local";

import { Providers } from "@/components/providers";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

import type { Metadata, Viewport } from "next";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "쓸로그",
  description: "쓸로그",
  applicationName: "쓸로그",
  appleWebApp: {
    capable: true,
    title: "쓸로그",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#5d5ef7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <OfflineBanner />
          {children}
        </Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
