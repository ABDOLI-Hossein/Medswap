import Link from "next/link";
import { CalendarDays, CalendarPlus, UserRoundCheck, Clock, ArrowRight, MessageSquare, Bell } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import Calendar from "@/components/Calendar";
import { Badge, Button, Card, CardTitle, Avatar } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { listAbsencesByOwner } from "@/lib/queries";
import { shortRange, todayIso, statusLabel } from "@/lib/mappers";
import { startConversation } from "@/app/actions";
import { db } from "@/lib/db-core.mjs";

export default async function TableauDeBordPage() {
  const user = await requireRole("installe");
  const absences = listAbsencesByOwner(user.id);
  const published = absences.filter((a) => a.status !== "brouillon");
  const confirmed = absences.filter((a) => a.status === "confirmee");
  const pending = absences.filter((a) => a.status === "publiee");
  const current = confirmed[0];
  const replacer = current?.replacerId ? db.prepare("SELECT id, first_name, last_name, zone FROM users WHERE id = ?").get(current.replacerId) : null;

  const marks = absences.map((a) => ({
    start: a.start,
    end: a.end,
    tone: a.status === "confirmee" ? "brand" : a.status === "publiee" ? "amber" : "neutral",
  }));

  const stats = [
    { value: published.length, label: "Périodes d’absence", sub: "Absences publiées ou confirmées", icon: CalendarDays, tone: "brand" },
    { value: confirmed.length, label: "Remplacements confirmés", sub: "Votre cabinet reste accompagné", icon: UserRoundCheck, tone: "brand" },
    { value: pending.length, label: "Période à pourvoir", sub: pending[0] ? shortRange(pending[0].start, pending[0].end) : "Aucune période ouverte", icon: Clock, tone: "amber" },
  ];

  const upcoming = absences.filter((a) => a.end >= todayIso()).slice(0, 4);

  return (
    <AppShell breadcrumb={["Tableau de bord"]}>
      <PageHeader
        eyebrow="Vos absences & remplacements"
        title={`Bonjour ${user.shortName}`}
        description="Publiez vos absences, choisissez un remplaçant et suivez vos missions en un coup d’œil."
        action={
          <Link href="/absences/nouvelle">
            <Button>
              <CalendarPlus className="h-4 w-4" /> Ajouter une absence
            </Button>
          </Link>
        }
      />

      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="flex items-center gap-4 p-5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.tone === "amber" ? "bg-amber-soft text-amber-ink" : "bg-brand-soft text-brand"}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-ink">{s.value}</span>
                  <span className="truncate text-sm font-medium text-ink">{s.label}</span>
                </p>
                <p className="mt-0.5 truncate text-xs text-muted">{s.sub}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-[1fr_340px] gap-6">
        <div className="flex flex-col gap-6">
          <Card>
            <CardTitle>Vos absences &amp; remplacements</CardTitle>
            <Calendar marks={marks} today={todayIso()} showLegend />
          </Card>

          <Card>
            <CardTitle
              action={
                <Link href="/absences/nouvelle" className="text-xs font-semibold text-brand hover:underline">
                  Nouvelle absence →
                </Link>
              }
            >
              Vos prochaines absences
            </CardTitle>
            {upcoming.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">Aucune absence planifiée. Publiez votre première absence.</p>
            ) : (
              <ul className="divide-y divide-line">
                {upcoming.map((a) => {
                  const st = statusLabel[a.status];
                  return (
                    <li key={a.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-muted">
                        <CalendarDays className="h-4 w-4" />
                      </span>
                      <div className="w-48">
                        <p className="text-sm font-semibold text-ink">{shortRange(a.start, a.end)}</p>
                        <p className="text-xs text-muted">{a.motif}</p>
                      </div>
                      <Badge tone={st.tone}>{st.label}</Badge>
                      <div className="ml-auto">
                        <Link href={`/absences/${a.id}`} className="flex items-center gap-2 text-sm font-medium text-brand hover:underline">
                          {a.status === "publiee" ? "Voir les candidatures" : "Détail"} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-base font-semibold text-ink">Publier une absence</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Définissez vos dates, choisissez un motif, puis publiez la mission. Les remplaçants compatibles sont alertés.
            </p>
            <Link href="/absences/nouvelle" className="mt-5 block">
              <Button className="w-full">
                <Bell className="h-4 w-4" /> Publier une absence
              </Button>
            </Link>
          </Card>

          <Card className="border-brand-soft bg-brand-soft/60">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-base font-semibold text-ink">Votre remplaçant actuel</h2>
              {current && <Badge tone="brand">Confirmé</Badge>}
            </div>
            {replacer && current ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar initials={`${replacer.first_name[0]}${replacer.last_name[0]}`} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Dr {replacer.first_name} {replacer.last_name}</p>
                    <p className="text-xs text-muted">{replacer.zone}</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-line pt-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-ink">
                    <CalendarDays className="h-4 w-4 text-brand" /> {shortRange(current.start, current.end)}
                  </p>
                </div>
                <form action={startConversation.bind(null, replacer.id)} className="mt-4">
                  <Button type="submit" variant="secondary" className="w-full">
                    <MessageSquare className="h-4 w-4" /> Contacter le remplaçant
                  </Button>
                </form>
              </>
            ) : (
              <p className="text-sm text-muted">Aucun remplacement confirmé pour le moment.</p>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
