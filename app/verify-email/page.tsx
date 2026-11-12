import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = { title: "Подтверждение email" };
export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string | string[] }> }) {
  const { email = "" } = await searchParams;
  return <AuthShell><VerifyEmailForm initialEmail={typeof email === "string" ? email : ""}/></AuthShell>;
}
