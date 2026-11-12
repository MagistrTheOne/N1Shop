"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw result.error;
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Не удалось завершить сеанс. Попробуйте ещё раз.");
      setBusy(false);
    }
  }
  return <div>{error && <p className="n1-auth-error" role="alert">{error}</p>}<button className="n1-button n1-button-white" onClick={logout} disabled={busy}>{busy ? "Выходим…" : "Выйти"}</button></div>;
}
