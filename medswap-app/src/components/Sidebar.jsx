"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronsUpDown,
  LayoutDashboard,
  MessageSquare,
  Settings,
  UsersRound,
  Stethoscope,
  ClipboardList,
  Clock,
  Mail,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { logout } from "@/app/actions";

const navByRole = {
  medecin: [
    { label: "Tableau de bord", href: "/tableau-de-bord", icon: LayoutDashboard },
    { label: "Mes absences", href: "/absences/nouvelle", icon: CalendarDays },
    { label: "Trouver un remplaçant", href: "/recherche", icon: UsersRound },
    { label: "Messagerie", href: "/messagerie", icon: MessageSquare },
  ],
  remplacant: [
    { label: "Trouver un remplacement", href: "/remplacant", icon: UsersRound },
    { label: "Mes disponibilités", href: "/profil", icon: Clock },
    { label: "Suivi des candidatures", href: "/remplacant/candidature", icon: ClipboardList },
    { label: "Messagerie", href: "/messagerie", icon: MessageSquare },
  ],
};

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const isMedecin = user.role === "installe";
  const items = navByRole[isMedecin ? "medecin" : "remplacant"];

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-line bg-white px-4 py-6">
      <div className="px-2">
        <Logo />
      </div>

      {/* Carte d’espace */}
      <div className="mt-6 rounded-xl bg-surface p-4">
        <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
          {isMedecin ? "Espace médecin" : "Espace remplaçant"}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">
            {isMedecin ? user.cabinetName || "Mon cabinet" : user.name}
          </p>
          {isMedecin && <ChevronsUpDown className="h-4 w-4 text-muted" />}
        </div>
        <p className="mt-0.5 text-xs text-muted">{user.zone}</p>
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1 leading-tight">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bloc d’aide */}
      <div className="mt-auto rounded-xl bg-brand-soft p-4">
        <Stethoscope className="h-5 w-5 text-brand" />
        <p className="mt-2 text-sm font-semibold text-ink">À vos côtés, au quotidien.</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Une question sur votre prochain remplacement ?
        </p>
        <Link href="/messagerie" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
          <Mail className="h-3.5 w-3.5" /> Contacter l’équipe
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-1 border-t border-line pt-4">
        <Link href="/parametres" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === "/parametres" ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface hover:text-ink"}`}>
          <Settings className="h-[18px] w-[18px]" /> Paramètres
        </Link>
        <form action={logout}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink">
            <LogOut className="h-[18px] w-[18px]" /> Se déconnecter
          </button>
        </form>
      </div>

      <Link href="/profil" className="mt-4 flex items-center gap-3 border-t border-line pt-4 hover:opacity-80">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
          {user.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
          <p className="truncate text-xs text-muted">{isMedecin ? "Médecin installé" : "Médecin remplaçant"}</p>
        </div>
      </Link>
    </aside>
  );
}
