import Logo from "@/components/Logo";
import Link from "next/link";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <Link href="/connexion" className="flex justify-center">
          <Logo className="h-10" />
        </Link>
        <h1 className="mt-6 text-center text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-center text-sm text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-center text-xs text-muted">{footer}</div>}
      </div>
    </div>
  );
}
