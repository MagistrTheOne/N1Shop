import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Вход" };
export default function Page() { return <AuthShell><AuthForm mode="login"/></AuthShell>; }
