"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth/client";

type AuthMode = "login" | "register" | "forgot" | "reset";

function messageFor(error: unknown) {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    const text = error.message.toLowerCase();
    if (text.includes("invalid") || text.includes("credential")) return "Проверьте адрес почты и пароль.";
    if (text.includes("exist") || text.includes("already")) return "Аккаунт с таким адресом уже существует.";
    if (text.includes("password")) return "Пароль не соответствует требованиям.";
  }
  return "Не удалось выполнить запрос. Проверьте данные и попробуйте ещё раз.";
}

export function AuthForm({ mode, token }: { mode: AuthMode; token?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    try {
      if (mode === "register") {
        const name = String(form.get("name") || "").trim();
        setRegisteredEmail(email);
        if (password !== form.get("confirmPassword")) throw new Error("password confirmation mismatch");
        const result = await authClient.signUp.email({ name, email, password, callbackURL: "/account" });
        if (result.error) throw result.error;
        if (!result.data?.user || !("session" in result.data && result.data.session)) {
          setNotice("Аккаунт создан. Проверьте почту для подтверждения адреса.");
          return;
        }
        const profileResponse = await fetch("/api/profile", { method: "POST" });
        if (!profileResponse.ok) throw new Error("profile save failed");
        router.push("/account");
        router.refresh();
        return;
      }
      if (mode === "login") {
        const result = await authClient.signIn.email({ email, password, callbackURL: "/account" });
        if (result.error) throw result.error;
        router.push("/account");
        router.refresh();
        return;
      }
      if (mode === "forgot") {
        const response = await fetch("/api/auth/request-password-reset", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, redirectTo: `${window.location.origin}/reset-password` }),
        });
        if (!response.ok) throw new Error("reset request failed");
        setNotice("Если аккаунт с таким адресом существует, инструкции для сброса пароля отправлены на почту.");
        return;
      }
      if (!token) throw new Error("invalid reset token");
      if (password !== form.get("confirmPassword")) throw new Error("password confirmation mismatch");
      const response = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (!response.ok) throw new Error("invalid reset token");
      setNotice("Пароль обновлён. Теперь войдите с новым паролем.");
      router.push("/login");
    } catch (cause) {
      setError(cause instanceof Error && cause.message === "password confirmation mismatch"
        ? "Пароли не совпадают."
        : messageFor(cause));
    } finally {
      setBusy(false);
    }
  }

  const title = { login: "Вход", register: "Создать аккаунт", forgot: "Сброс пароля", reset: "Новый пароль" }[mode];
  return <section className="n1-auth-card">
    <span className="n1-kicker">N1 / АККАУНТ</span><h1>{title}</h1>
    {mode === "reset" && !token && <p className="n1-auth-error" role="alert">Ссылка сброса отсутствует или недействительна. Запросите новую.</p>}
    <form onSubmit={submit} className="n1-auth-form">
      {mode === "register" && <label>Имя<input name="name" autoComplete="name" required minLength={2} maxLength={80}/></label>}
      {mode !== "reset" && <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>}
      {(mode === "login" || mode === "register" || mode === "reset") && <label>Пароль<span className="n1-password-field"><input name="password" type={showPasswords ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} maxLength={128}/><button type="button" aria-label={showPasswords ? "Скрыть пароль" : "Показать пароль"} onClick={() => setShowPasswords(value => !value)}>{showPasswords ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label>}
      {(mode === "register" || mode === "reset") && <label>Повторите пароль<span className="n1-password-field"><input name="confirmPassword" type={showPasswords ? "text" : "password"} autoComplete="new-password" required minLength={8} maxLength={128}/><button type="button" aria-label={showPasswords ? "Скрыть пароли" : "Показать пароли"} onClick={() => setShowPasswords(value => !value)}>{showPasswords ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label>}
      {error && <p role="alert" className="n1-auth-error">{error}</p>}
      {notice && <p role="status" className="n1-auth-notice">{notice}</p>}
      {mode === "register" && notice && <Link href={`/verify-email?email=${encodeURIComponent(registeredEmail)}`}>Ввести код подтверждения</Link>}
      <button className="n1-button n1-button-white" type="submit" disabled={busy || (mode === "reset" && !token)}>{busy ? "Подождите…" : title}</button>
    </form>
    <nav className="n1-auth-links" aria-label="Ссылки аккаунта">
      {mode === "login" && <><Link href="/forgot-password">Забыли пароль?</Link><Link href="/register">Создать аккаунт</Link></>}
      {mode === "register" && <Link href="/login">Уже есть аккаунт? Войти</Link>}
      {(mode === "forgot" || mode === "reset") && <Link href="/login">Вернуться ко входу</Link>}
    </nav>
  </section>;
}
