import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = {
  title: {default:"N1 — Магазин техники Apple", template:"%s | N1"},
  description:"N1 — независимый магазин техники Apple. iPhone, Mac, iPad, Apple Watch, AirPods и аксессуары.",
  applicationName:"N1 Store",
  robots:{index:false,follow:false},
};
export const viewport:Viewport = {width:"device-width",initialScale:1,themeColor:"#08090b"};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="ru" className={`${inter.variable} dark`}><body className="min-h-screen bg-[#08090b] text-[#f5f5f7] antialiased">{children}</body></html>}
