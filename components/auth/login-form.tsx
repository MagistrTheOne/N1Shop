"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage, normalizedEmail, requiresEmailVerification, safeInternalRedirect } from "./auth-errors";
import { PasswordField } from "./password-field";

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const destination = safeInternalRedirect(returnTo);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setVerificationEmail("");
    const form = new FormData(event.currentTarget);
    const email = normalizedEmail(form.get("email"));
    const password = String(form.get("password") || "");
    try {
      const result = await authClient.signIn.email({ email, password, callbackURL: destination });
      if (result.error) throw result.error;
      router.replace(destination);
      router.refresh();
    } catch (cause) {
      setError(authErrorMessage(cause, "login"));
      if (requiresEmailVerification(cause)) setVerificationEmail(email);
    } finally { setBusy(false); }
  }

  return <section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Вход</h1>
    <form onSubmit={submit} className="n1-auth-form">
      <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      <PasswordField name="password" label="Пароль" autoComplete="current-password"/>
      {error && <p role="alert" className="n1-auth-error">{error}</p>}
      {verificationEmail && <Link href={`/verify-email?email=${encodeURIComponent(verificationEmail)}`}>Подтвердить email</Link>}
      <button className="n1-button n1-button-white" type="submit" disabled={busy}>{busy ? "Входим…" : "Войти"}</button>
    </form>
    <nav className="n1-auth-links" aria-label="Ссылки аккаунта"><Link href="/forgot-password">Забыли пароль?</Link><Link href="/register">Создать аккаунт</Link></nav>
  </section>;
}
