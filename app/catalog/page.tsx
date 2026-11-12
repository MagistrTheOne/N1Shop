import type { Metadata } from "next";
import { CatalogPage } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Каталог техники Apple",
  description: "Каталог N1: iPhone, Mac, iPad, Apple Watch, AirPods и аксессуары.",
};

export default function Page() {
  return <CatalogPage />;
}
