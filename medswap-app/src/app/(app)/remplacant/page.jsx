import Link from "next/link";
import { Bell, CalendarDays, MapPin, Stethoscope, FileText, ArrowRight, Info, Check } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import Calendar from "@/components/Calendar";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { listPublishedMissions, listCandidaturesForUser, listAvailabilities } from "@/lib/queries";
import { shortRange, daysBetween, todayIso, candidatureLabel } from "@/lib/mappers";
import { applyToAbsence } from "@/app/actions";
import { db } from "@/lib/db-core.mjs";

export default async function EspaceRemplacantPage() {
  const user = await requireRole("remplacant");
  const missions = listPublishedMissions(user.id);
  const mine = listCandidaturesForUser(user.id);
  const appliedIds = new Set(mine.map((c) => c.absenceId));
  const availabilities = listAvailabilities(user.id);
  const today = todayIso();
  const marks = availabilities.map((a) => ({ start: a.start, end: a.end, tone: "health" }));

  return (
    <AppShell breadcrumb={["Trouver un remplacement"]}>
      <PageHeader
        eyebrow="Les annonces qui vous correspondent"
        title={`Bonjour ${user.shortName}`}
        description="Consultez les missions publiées par les médecins installés et postulez en un clic."
        action={
          <Link href="/profil">
            <Button variant="secondary"><CalendarDays className="h-4 w-4" /> Mes disponibilités</Button>
          </Link>
        }
      />

      {missions.length > 0 && (
        <div className="mt-8 flex items-start gap-4 rounded-2xl bg-brand-soft p-5">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <div>
            <p className="text-sm font-semibold text-ink">{missions.length} mission{missions.length > 1 ? "s" : ""} publiée{missions.length > 1 ? "s" : ""} actuellement</p>
            <p className="mt-1 text-xs text-muted">Mettez vos disponibilités à jour pour recevoir des propositions pertinentes.</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-[1fr_340px] gap-6">
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-ink">{missions.length} mission{missions.length > 1 ? "s" : ""} ouverte{missions.length > 1 ? "s" : ""}</h2>

          {missions.length === 0 && (
            <Card><p className="py-8 text-center text-sm text-muted">Aucune mission ouverte pour le moment.</p></Card>
          )}

          {missions.map((m) => {
            const applied = appliedIds.has(m.id);
            const inPeriod = availabilities.some((a) => a.start <= m.start && a.end >= m.end);
            return (
              <Card key={m.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{m.motif} · {m.cabinetName}</h3>
                    <p className="mt-1 text-xs text-muted">{m.cabinetAddress} · {daysBetween(m.start, m.end)} jours</p>
                  </div>
                  <Badge tone="warning">Disponible</Badge>
                </div>

                <div className="mt-5 flex items-center gap-4 rounded-xl bg-brand-soft p-4">
                  <CalendarDays className="h-6 w-6 text-brand" />
                  <div>
                    <p className="text-lg font-semibold text-ink">{shortRange(m.start, m.end)}</p>
                    <p className="text-xs text-muted">{inPeriod ? "Compatible avec vos disponibilités" : "Vérifiez vos disponibilités sur cette période"}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <Stethoscope className="mt-0.5 h-4 w-4 text-brand" />
                    <div><p className="text-xs text-muted">Activité</p><p className="text-sm font-medium text-ink">{m.activities}</p></div>
                  </div>
                  <div className="flex gap-3">
                    <FileText className="mt-0.5 h-4 w-4 text-brand" />
                    <div><p className="text-xs text-muted">Conditions</p><p className="text-sm font-medium text-ink">{m.retrocession || "À convenir"} · {m.lodging}</p></div>
                  </div>
                </div>

                {m.schedule && <p className="mt-5 text-sm leading-relaxed text-muted">{m.schedule}</p>}

                <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={m.ownerName.replace("Dr ", "").split(" ").map((p) => p[0]).join("")} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-ink">{m.ownerName}</p>
                      <p className="text-xs text-muted">{m.cabinetName}</p>
                    </div>
                  </div>
                  {applied ? (
                    <Badge tone="success"><Check className="mr-1 h-3 w-3" /> Candidature envoyée</Badge>
                  ) : (
                    <form action={applyToAbsence.bind(null, m.id)}>
                      <Button type="submit"><ArrowRight className="h-4 w-4" /> Postuler</Button>
                    </form>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <aside className="flex flex-col gap-6">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-ink">Vos disponibilités</h2>
            <Calendar marks={marks} today={today} />
            {availabilities.length === 0 ? (
              <p className="mt-4 border-t border-line pt-4 text-xs text-muted">Aucune disponibilité déclarée. Ajoutez vos périodes dans « Mes disponibilités ».</p>
            ) : (
              <ul className="mt-4 space-y-2 border-t border-line pt-4 text-xs text-muted">
                {availabilities.map((a) => <li key={a.id} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-health" />{shortRange(a.start, a.end)}</li>)}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-ink">Votre profil candidat</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar initials={user.initials} size="lg" tone="health" />
              <div>
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <p className="text-xs text-muted">{user.specialty} · {user.zone}</p>
              </div>
            </div>
            <Link href="/profil" className="mt-4 block">
              <Button variant="secondary" className="w-full">Modifier mon profil</Button>
            </Link>
          </Card>

          <p className="flex items-start gap-2 px-1 text-xs text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {mine.length} candidature{mine.length > 1 ? "s" : ""} envoyée{mine.length > 1 ? "s" : ""}.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
