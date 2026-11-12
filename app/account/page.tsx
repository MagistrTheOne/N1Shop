import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LogoutButton } from "@/components/auth/logout-button";
import { ProfileForm } from "@/components/auth/profile-form";
import { getCurrentUser } from "@/lib/auth/session";
import { ensureProfile } from "@/lib/db/queries/profiles";

export const metadata: Metadata = { title: "Аккаунт" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await ensureProfile();
  if (!profile) redirect("/login");

  return <AuthShell><section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Мой аккаунт</h1>
    <dl className="n1-account-details"><div><dt>Email</dt><dd>{profile.email}</dd></div><div><dt>Статус почты</dt><dd>{user.emailVerified ? "Подтверждена" : "Не подтверждена"}</dd></div><div><dt>Аккаунт создан</dt><dd>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(profile.createdAt)}</dd></div></dl>
    <ProfileForm displayName={profile.displayName}/>
    <LogoutButton/>
  </section></AuthShell>;
}
