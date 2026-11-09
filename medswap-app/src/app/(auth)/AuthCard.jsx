import Logo from "@/components/Logo";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5173";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <Link href="/connexion" className="flex justify-center">
          <Logo className="h-10" />
        </Link>
        <a href={SITE_URL} className="mt-4 block text-center text-xs font-medium text-muted hover:text-brand">
          ← Retour au site MedSwap
        </a>
        <h1 className="mt-6 text-center text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-center text-sm text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-center text-xs text-muted">{footer}</div>}
      </div>
    </div>
  );
}
