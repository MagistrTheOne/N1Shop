import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Новый пароль" };
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  return <AuthShell><ResetPasswordForm token={typeof token === "string" ? token : undefined}/></AuthShell>;
}
