
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://n1.ru"),

  title: {
    default: "N1 — Магазин техники Apple",
    template: "%s | N1",
  },

  description:
    "N1 — магазин техники Apple в России. iPhone, Mac, iPad, Apple Watch, AirPods и аксессуары. Каталог, выгодные предложения и удобный выбор.",

  applicationName: "N1 Store",

  keywords: [
    "N1",
    "Apple",
    "iPhone",
    "MacBook",
    "iPad",
    "Apple Watch",
    "AirPods",
    "магазин Apple",
    "купить iPhone",
    "техника Apple",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "N1",
    title: "N1 — Магазин техники Apple",
    description:
      "Техника Apple. Премиальный выбор. iPhone, Mac, iPad и аксессуары.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} dark`}>
      <body
        className="
          min-h-screen
          bg-[#080808]
          text-[#F5F5F7]
          font-sans
          antialiased
          selection:bg-white
          selection:text-black
        "
      >
        {children}
      </body>
    </html>
  );
}
