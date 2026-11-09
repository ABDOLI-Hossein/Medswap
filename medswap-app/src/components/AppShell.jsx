import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { requireUser } from "@/lib/auth";
import { listNotifications, unreadNotificationCount } from "@/lib/queries";
import { BRAND } from "@/lib/brand";

const today = () =>
  new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/**
 * Coque des écrans authentifiés : barre latérale, fil d’Ariane, notifications et pied de page.
 * L’utilisateur est lu depuis la session ; le rôle détermine la navigation.
 */
export default async function AppShell({ breadcrumb = [], children }) {
  const user = await requireUser();
  const notifications = listNotifications(user.id);
  const unread = unreadNotificationCount(user.id);
  const spaceLabel = user.role === "installe" ? "Espace médecin" : "Espace remplaçant";

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-10">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <span>{spaceLabel}</span>
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb}-${i}`} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <span className={i === breadcrumb.length - 1 ? "font-medium text-ink" : ""}>{crumb}</span>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-2 text-sm text-muted md:flex">
              <CalendarDays className="h-4 w-4" />
              <span className="capitalize">{today()}</span>
            </span>
            <NotificationBell notifications={notifications} unread={unread} />
            <Link href="/profil" aria-label="Mon profil" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand hover:ring-2 hover:ring-brand-soft">
              {user.initials}
            </Link>
          </div>
        </header>

        <main className="flex-1 px-10 pt-10 pb-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="flex items-center justify-between px-10 py-6 text-xs text-muted">
          <span>La continuité des soins commence par une bonne organisation.</span>
          <span>{BRAND.footer}</span>
        </footer>
      </div>
    </div>
  );
}

/** Titre de page standard (surtitre, titre, sous-titre et action optionnelle). */
export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        {eyebrow && <p className="text-xs font-semibold tracking-wide text-brand uppercase">{eyebrow}</p>}
        <h1 className="mt-2 text-[34px] leading-tight font-bold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
