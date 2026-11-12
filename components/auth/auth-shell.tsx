import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return <main className="n1-auth-page"><Link href="/" className="n1-brand" aria-label="N1 — на главную"><strong>N1</strong><i/><span>Магазин техники Apple<br/>в России</span></Link>{children}</main>;
}
