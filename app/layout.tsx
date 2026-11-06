import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Suspense } from "react";

import { BRAND_CONFIG } from "@/lib/config/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline} | Digital Entertainment & Resources`,
  description: "Cinema, TV series, anime, educational courses, and high-speed digital resources streaming platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-[#08090D] text-[#F5F5F7] antialiased">
        <Suspense fallback={<div className="h-16 bg-[#08090D]" />}>
          <Navbar />
        </Suspense>
        <PageContainer>
          {children}
        </PageContainer>
        <Suspense fallback={null}>
          <MobileNavigation />
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
