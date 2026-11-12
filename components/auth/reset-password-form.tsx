"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authErrorMessage } from "./auth-errors";
import { PasswordField } from "./password-field";

export function ResetPasswordForm({ token }: { token?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !token) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== form.get("confirmPassword")) {
      setError("Пароли не совпадают.");
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (!response.ok) throw new Error("reset failed");
      setComplete(true);
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally { setBusy(false); }
  }

  return <section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Новый пароль</h1>
    {!token && <p className="n1-auth-error" role="alert">Ссылка сброса отсутствует или недействительна. Запросите новую.</p>}
    {complete ? <><p className="n1-auth-notice" role="status">Пароль обновлён. Теперь войдите с новым паролем.</p><Link href="/login" className="n1-button n1-button-white">Перейти ко входу</Link></>
      : <form onSubmit={submit} className="n1-auth-form">
        <PasswordField name="password" label="Новый пароль" autoComplete="new-password"/>
        <PasswordField name="confirmPassword" label="Повторите пароль" autoComplete="new-password"/>
        {error && <p role="alert" className="n1-auth-error">{error}</p>}
        <button className="n1-button n1-button-white" type="submit" disabled={busy || !token}>{busy ? "Обновляем…" : "Обновить пароль"}</button>
      </form>}
    <nav className="n1-auth-links"><Link href="/login">Вернуться ко входу</Link></nav>
  </section>;
}
