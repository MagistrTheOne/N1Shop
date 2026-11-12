"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function AuthStatus({ onSessionChange }: { onSessionChange?: (signedIn: boolean) => void }) {
  const [state, setState] = useState<"loading" | "guest" | "signed-in">("loading");
  useEffect(() => {
    let active = true;
    const resolveSession = () => authClient.getSession().then(({ data }) => {
      if (active) {
        const signedIn = Boolean(data?.user);
        setState(signedIn ? "signed-in" : "guest");
        onSessionChange?.(signedIn);
      }
    }).catch(() => { if (active) { setState("guest"); onSessionChange?.(false); } });
    void resolveSession();
    window.addEventListener("focus", resolveSession);
    window.addEventListener("pageshow", resolveSession);
    window.addEventListener("storage", resolveSession);
    return () => {
      active = false;
      window.removeEventListener("focus", resolveSession);
      window.removeEventListener("pageshow", resolveSession);
      window.removeEventListener("storage", resolveSession);
    };
  }, [onSessionChange]);
  return <Link href={state === "signed-in" ? "/account" : "/login"} className="n1-account" aria-label={state === "loading" ? "Проверка аккаунта" : state === "signed-in" ? "Мой аккаунт" : "Войти"} aria-busy={state === "loading"}>
    <UserRound size={20}/>
  </Link>;
}
