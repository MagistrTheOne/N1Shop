import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth/session";
import { getProfileByAuthUserId, upsertProfile } from "@/lib/db/queries/profiles";

export const metadata: Metadata = { title: "Аккаунт" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  let profile = await getProfileByAuthUserId(user.id);
  profile ??= await upsertProfile({ authUserId: user.id, displayName: user.name || user.email, email: user.email });

  return <AuthShell><section className="n1-auth-card"><span className="n1-kicker">N1 / АККАУНТ</span><h1>Мой аккаунт</h1>
    <dl className="n1-account-details"><div><dt>Имя</dt><dd>{profile.displayName}</dd></div><div><dt>Email</dt><dd>{profile.email}</dd></div><div><dt>Статус почты</dt><dd>{user.emailVerified ? "Подтверждена" : "Не подтверждена"}</dd></div></dl>
    <LogoutButton/>
  </section></AuthShell>;
}
