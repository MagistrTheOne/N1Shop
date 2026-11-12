"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authErrorMessage, normalizedEmail } from "./auth-errors";

export function ForgotPasswordForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    const email = normalizedEmail(new FormData(event.currentTarget).get("email"));
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
        body: JSON.stringify({ email, redirectTo: `${window.location.origin}/reset-password` }),
      });
      if (!response.ok) throw new Error("request failed");
      setNotice("Если аккаунт с таким адресом существует, инструкции для сброса пароля отправлены на почту.");
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally { setBusy(false); }
  }

  return <section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Сброс пароля</h1>
    <form onSubmit={submit} className="n1-auth-form">
      <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      {error && <p role="alert" className="n1-auth-error">{error}</p>}
      {notice && <p role="status" className="n1-auth-notice">{notice}</p>}
      <button className="n1-button n1-button-white" type="submit" disabled={busy}>{busy ? "Отправляем…" : "Отправить ссылку"}</button>
    </form>
    <nav className="n1-auth-links"><Link href="/login">Вернуться ко входу</Link></nav>
  </section>;
}
