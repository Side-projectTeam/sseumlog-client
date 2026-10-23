import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

import type { Metadata, Viewport } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "쓸로그",
  description: "쓸로그",
  applicationName: "쓸로그",
  appleWebApp: {
    capable: true,
    title: "쓸로그",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
