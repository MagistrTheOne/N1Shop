"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage, normalizedEmail } from "./auth-errors";
import { PasswordField } from "./password-field";

export function RegisterForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    setVerificationRequired(false);
    const form = new FormData(event.currentTarget);
    const normalized = normalizedEmail(form.get("email"));
    const name = String(form.get("name") || "").trim();
    const password = String(form.get("password") || "");
    setEmail(normalized);
    if (name.length < 2 || name.length > 80) {
      setError("Укажите имя длиной от 2 до 80 символов.");
      setBusy(false);
      return;
    }
    if (password !== form.get("confirmPassword")) {
      setError("Пароли не совпадают.");
      setBusy(false);
      return;
    }
    try {
      const result = await authClient.signUp.email({ name, email: normalized, password, callbackURL: "/account" });
      if (result.error) throw result.error;
      const user = result.data?.user;
      const hasSession = Boolean(result.data && "session" in result.data && result.data.session);
      if (user && !user.emailVerified) {
        setVerificationRequired(true);
        setNotice("Аккаунт создан. Подтвердите email по ссылке или коду из письма.");
        return;
      }
      if (!hasSession) {
        setVerificationRequired(true);
        setNotice("Аккаунт создан. Подтвердите email по ссылке или коду из письма.");
        return;
      }
      const profileResponse = await fetch("/api/profile", { method: "POST", cache: "no-store" });
      if (!profileResponse.ok) {
        setNotice("Аккаунт создан. Войдите, чтобы завершить настройку профиля.");
        return;
      }
      router.replace("/account");
      router.refresh();
    } catch (cause) {
      setError(authErrorMessage(cause, "register"));
    } finally { setBusy(false); }
  }

  return <section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Создать аккаунт</h1>
    <form onSubmit={submit} className="n1-auth-form">
      <label>Полное имя<input name="name" autoComplete="name" required minLength={2} maxLength={80}/></label>
      <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      <PasswordField name="password" label="Пароль" autoComplete="new-password"/>
      <PasswordField name="confirmPassword" label="Повторите пароль" autoComplete="new-password"/>
      {error && <p role="alert" className="n1-auth-error">{error}</p>}
      {notice && <p role="status" className="n1-auth-notice">{notice}</p>}
      {verificationRequired && email && <Link href={`/verify-email?email=${encodeURIComponent(email)}`}>Ввести код подтверждения</Link>}
      <button className="n1-button n1-button-white" type="submit" disabled={busy}>{busy ? "Создаём аккаунт…" : "Создать аккаунт"}</button>
    </form>
    <nav className="n1-auth-links"><Link href="/login">Уже есть аккаунт? Войти</Link></nav>
  </section>;
}
