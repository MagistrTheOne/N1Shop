"use client";

import { useState, type FormEvent } from "react";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    const name = String(new FormData(event.currentTarget).get("displayName") || "").trim();
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, cache: "no-store",
        body: JSON.stringify({ displayName: name }),
      });
      if (!response.ok) throw new Error("profile update failed");
      setNotice("Имя обновлено.");
    } catch {
      setError("Не удалось обновить профиль. Попробуйте ещё раз.");
    } finally { setBusy(false); }
  }
  return <form className="n1-auth-form" onSubmit={submit}>
    <label>Имя<input name="displayName" autoComplete="name" required minLength={2} maxLength={80} defaultValue={displayName}/></label>
    {error && <p role="alert" className="n1-auth-error">{error}</p>}
    {notice && <p role="status" className="n1-auth-notice">{notice}</p>}
    <button className="n1-button n1-button-white" type="submit" disabled={busy}>{busy ? "Сохраняем…" : "Сохранить имя"}</button>
  </form>;
}
