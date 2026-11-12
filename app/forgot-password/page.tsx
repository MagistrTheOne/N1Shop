import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Сброс пароля" };
export default function Page() { return <AuthShell><ForgotPasswordForm/></AuthShell>; }
