import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Регистрация" };
export default function Page() { return <AuthShell><RegisterForm/></AuthShell>; }
