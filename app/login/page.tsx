import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Вход" };
export default async function Page({ searchParams }: { searchParams: Promise<{ returnTo?: string | string[] }> }) {
  const { returnTo } = await searchParams;
  return <AuthShell><LoginForm returnTo={typeof returnTo === "string" ? returnTo : undefined}/></AuthShell>;
}
