"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export function VerifyEmailForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const otp = String(form.get("otp") || "").trim();
    try {
      const result = await authClient.emailOtp.verifyEmail({ email, otp });
      if (result.error) throw result.error;
      await authClient.getSession();
      const profile = await fetch("/api/profile", { method: "POST" });
      if (!profile.ok && profile.status !== 401) throw new Error("profile unavailable");
      router.replace("/account");
      router.refresh();
    } catch {
      setError("Код недействителен или истёк. Проверьте данные и запросите новый код.");
    } finally { setBusy(false); }
  }
  return <section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Подтверждение email</h1>
    <form onSubmit={submit} className="n1-auth-form"><label>Email<input name="email" type="email" autoComplete="email" required defaultValue={initialEmail}/></label>
      <label>Код из письма<input name="otp" inputMode="numeric" autoComplete="one-time-code" required minLength={4} maxLength={12}/></label>
      {error && <p role="alert" className="n1-auth-error">{error}</p>}
      <button className="n1-button n1-button-white" type="submit" disabled={busy}>{busy ? "Проверяем…" : "Подтвердить"}</button>
    </form><nav className="n1-auth-links"><Link href="/login">Вернуться ко входу</Link></nav>
  </section>;
}
