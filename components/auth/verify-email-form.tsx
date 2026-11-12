"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export function VerifyEmailForm({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState(initialEmail);

  async function resendCode() {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await authClient.emailOtp.sendVerificationOtp({ email: email.trim().toLowerCase(), type: "email-verification" });
      if (result.error) throw result.error;
      setNotice("Если адрес ожидает подтверждения, новый код отправлен на почту.");
    } catch {
      setError("Не удалось отправить код. Проверьте настройки почты и попробуйте позже.");
    } finally { setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const normalized = String(form.get("email") || "").trim().toLowerCase();
    const otp = String(form.get("otp") || "").trim();
    try {
      const result = await authClient.emailOtp.verifyEmail({ email: normalized, otp });
      if (result.error) throw result.error;
      const session = await authClient.getSession();
      if (session.data?.user) {
        const profile = await fetch("/api/profile", { method: "POST", cache: "no-store" });
        if (!profile.ok) throw new Error("profile synchronization failed");
        router.replace("/account");
        router.refresh();
        return;
      }
      setEmail(normalized);
      setNotice("Email подтверждён. Теперь войдите в аккаунт.");
    } catch {
      setError("Код недействителен или истёк. Проверьте его и запросите новый код.");
    } finally { setBusy(false); }
  }

  return <section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Подтверждение email</h1>
    <form onSubmit={submit} className="n1-auth-form">
      <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)}/></label>
      <label>Код из письма<input name="otp" inputMode="numeric" autoComplete="one-time-code" required minLength={4} maxLength={12}/></label>
      {error && <p role="alert" className="n1-auth-error">{error}</p>}
      {notice && <p role="status" className="n1-auth-notice">{notice}</p>}
      <button className="n1-button n1-button-white" type="submit" disabled={busy}>{busy ? "Проверяем…" : "Подтвердить"}</button>
      <button className="n1-button n1-button-outline" type="button" disabled={busy || !email} onClick={resendCode}>{busy ? "Подождите…" : "Отправить код повторно"}</button>
    </form><nav className="n1-auth-links"><Link href="/login">Вернуться ко входу</Link>{notice && <Link href="/login">Войти</Link>}</nav>
  </section>;
}
