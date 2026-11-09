import Link from "next/link";
import { Lock, MessageSquare, ShieldCheck, SquarePen, UsersRound } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import { Avatar, Button, Card } from "@/components/ui";
import Composer from "./Composer";
import { requireUser } from "@/lib/auth";
import { getConversationFor, listConversations, listMessages, listRemplacants, listPublishedMissions } from "@/lib/queries";
import { startConversation } from "@/app/actions";
import { db } from "@/lib/db-core.mjs";

export default async function MessageriePage({ searchParams }) {
  const user = await requireUser();
  const { c, q = "", nouveau } = await searchParams;
  const conversations = listConversations(user.id).filter(
    (conv) => !q || conv.name.toLowerCase().includes(String(q).toLowerCase()),
  );
  const active = c ? getConversationFor(Number(c), user.id) : null;
  const messages = active ? listMessages(active.id) : [];

  const recipients = user.role === "installe"
    ? listRemplacants()
    : db.prepare("SELECT * FROM users WHERE role = 'installe' ORDER BY last_name").all().map((r) => ({ id: r.id, name: `Dr ${r.first_name} ${r.last_name}`, zone: r.cabinet_name || r.zone, initials: `${r.first_name[0]}${r.last_name[0]}`.toUpperCase() }));

  return (
    <AppShell breadcrumb={["Messagerie"]}>
      <PageHeader
        eyebrow="Échanges sécurisés"
        title="Votre messagerie"
        description="Suivez les échanges avec vos interlocuteurs et démarrez de nouvelles conversations."
        action={
          <Link href="/messagerie?nouveau=1">
            <Button><SquarePen className="h-4 w-4" /> Nouveau message</Button>
          </Link>
        }
      />

      <div className="mt-8 grid h-[680px] grid-cols-[300px_1fr] overflow-hidden rounded-2xl border border-line bg-white">
        <aside className="flex min-h-0 flex-col border-r border-line">
          <form className="px-5 pt-5" action="/messagerie">
            <input name="q" defaultValue={q} placeholder="Rechercher une conversation" className="w-full rounded-xl border border-line-strong px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft" />
          </form>
          <ul className="mt-4 flex-1 overflow-y-auto">
            {conversations.length === 0 && <li className="px-5 py-6 text-xs text-muted">Aucune conversation. Démarrez-en une avec « Nouveau message ».</li>}
            {conversations.map((conv) => {
              const on = active?.id === conv.id;
              return (
                <li key={conv.id}>
                  <Link href={`/messagerie?c=${conv.id}`} className={`flex gap-3 border-b border-line px-5 py-4 transition-colors ${on ? "bg-brand-soft" : "hover:bg-surface"}`}>
                    <Avatar initials={conv.initials} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{conv.name}</p>
                      <p className="truncate text-xs text-muted">{conv.meta}</p>
                      <p className="mt-1 truncate text-xs text-ink">{conv.last}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-line bg-surface px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Lock className="h-4 w-4 text-brand" /> Un espace de confiance</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">Vos échanges restent privés entre vous et vos interlocuteurs.</p>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col">
          {nouveau ? (
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-base font-semibold text-ink">Nouveau message</h2>
              <p className="mt-1 text-xs text-muted">Choisissez un interlocuteur pour ouvrir une conversation.</p>
              <ul className="mt-5 flex flex-col gap-3">
                {recipients.map((r) => (
                  <li key={r.id}>
                    <form action={startConversation.bind(null, r.id)}>
                      <button type="submit" className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left hover:bg-surface">
                        <Avatar initials={r.initials} size="sm" tone="health" />
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-ink">{r.name}</span>
                          <span className="block text-xs text-muted">{r.zone}</span>
                        </span>
                        <MessageSquare className="h-4 w-4 text-brand" />
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ) : active ? (
            <>
              <header className="flex items-center gap-3 border-b border-line px-6 py-4">
                <Avatar initials={`${active.other.firstName[0]}${active.other.lastName[0]}`} />
                <div>
                  <p className="text-sm font-semibold text-ink">{active.other.name}</p>
                  <p className="text-xs text-muted">{active.other.role === "installe" ? "Médecin installé" : "Médecin remplaçant"} · {active.other.zone}</p>
                </div>
              </header>
              <div className="flex items-center justify-center gap-2 bg-brand-soft/60 px-4 py-2 text-xs text-brand">
                <ShieldCheck className="h-3.5 w-3.5" /> Messagerie sécurisée · Échanges confidentiels
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto bg-surface px-6 py-5">
                {messages.length === 0 && <p className="pt-10 text-center text-sm text-muted">Aucun message pour le moment. Commencez la conversation.</p>}
                {messages.map((m) => {
                  const mine = m.senderId === user.id;
                  return (
                    <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${mine ? "rounded-br-md bg-brand text-white" : "rounded-bl-md border border-line bg-white text-ink"}`}>
                        {m.body}
                      </div>
                      <span className="mt-1 text-[11px] text-muted">{m.createdAt}</span>
                    </div>
                  );
                })}
              </div>
              <Composer conversationId={active.id} />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
              <UsersRound className="h-8 w-8 text-brand" />
              <p className="text-sm font-semibold text-ink">Sélectionnez une conversation</p>
              <p className="text-xs text-muted">ou démarrez-en une nouvelle depuis « Nouveau message ».</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
