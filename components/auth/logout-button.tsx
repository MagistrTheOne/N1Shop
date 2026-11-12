"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    const { error } = await authClient.signOut();
    if (!error) { router.replace("/login"); router.refresh(); }
    else setBusy(false);
  }
  return <button className="n1-button n1-button-white" onClick={logout} disabled={busy}>{busy ? "Выходим…" : "Выйти"}</button>;
}
