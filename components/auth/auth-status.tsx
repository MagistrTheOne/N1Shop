"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function AuthStatus({ onSessionChange }: { onSessionChange?: (signedIn: boolean) => void }) {
  const [state, setState] = useState<"loading" | "guest" | "signed-in">("loading");
  useEffect(() => {
    let active = true;
    authClient.getSession().then(({ data }) => {
      if (active) {
        const signedIn = Boolean(data?.user);
        setState(signedIn ? "signed-in" : "guest");
        onSessionChange?.(signedIn);
      }
    }).catch(() => { if (active) { setState("guest"); onSessionChange?.(false); } });
    return () => { active = false; };
  }, [onSessionChange]);
  return <Link href={state === "signed-in" ? "/account" : "/login"} className="n1-account" aria-label={state === "loading" ? "Проверка аккаунта" : state === "signed-in" ? "Мой аккаунт" : "Войти"} aria-busy={state === "loading"}>
    <UserRound size={20}/>
  </Link>;
}
