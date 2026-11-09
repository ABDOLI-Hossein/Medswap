import Link from "next/link";
import { CalendarDays, MessageSquare, MapPin, Stethoscope } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { listRemplacants, listPublishedMissions } from "@/lib/queries";
import { shortRange, todayIso } from "@/lib/mappers";
import { startConversation } from "@/app/actions";

export default async function RecherchePage() {
  const user = await requireRole("installe");
  const remplacants = listRemplacants();
  const today = todayIso();
  const openMission = listPublishedMissions(-1).find((m) => m.ownerId === user.id);

  return (
    <AppShell breadcrumb={["Trouver un remplaçant"]}>
      <PageHeader
        eyebrow="Votre mission · Choisissez un remplaçant"
        title="Trouvez votre remplaçant"
        description="Consultez les disponibilités des remplaçants inscrits et contactez-les directement."
      />

      <div className="mt-8 grid grid-cols-[1fr_340px] gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">{remplacants.length} remplaçant{remplacants.length > 1 ? "s" : ""} inscrit{remplacants.length > 1 ? "s" : ""}</h2>
            <p className="text-xs text-muted">Triés par nom. Les disponibilités sont celles déclarées par chaque remplaçant.</p>
          </div>

          {remplacants.length === 0 && (
            <Card><p className="py-6 text-center text-sm text-muted">Aucun remplaçant inscrit pour le moment.</p></Card>
          )}

          {remplacants.map((r) => {
            const upcoming = r.availabilities.filter((a) => a.end >= today);
            return (
              <Card key={r.id} className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar initials={r.initials} size="lg" tone="health" />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-ink">{r.name}</p>
                    <p className="text-xs text-muted">{r.specialty} · {r.zone}</p>
                    {r.rpps && <p className="mt-1 text-xs text-muted">RPPS {r.rpps}</p>}
                  </div>
                  <Badge tone={upcoming.length ? "success" : "neutral"}>{upcoming.length ? `${upcoming.length} période${upcoming.length > 1 ? "s" : ""} disponible${upcoming.length > 1 ? "s" : ""}` : "Aucune disponibilité"}</Badge>
                </div>

                {upcoming.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {upcoming.map((a) => (
                      <span key={a.id} className="flex items-center gap-1.5 rounded-lg bg-health-soft px-3 py-1.5 text-xs font-medium text-health">
                        <CalendarDays className="h-3.5 w-3.5" /> {shortRange(a.start, a.end)}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <form action={startConversation.bind(null, r.id)}>
                    <Button type="submit" className="px-3 py-2 text-xs"><MessageSquare className="h-3.5 w-3.5" /> Contacter</Button>
                  </form>
                </div>
              </Card>
            );
          })}
        </div>

        <aside className="flex flex-col gap-6">
          <Card>
            <p className="text-[11px] font-semibold tracking-wide text-brand uppercase">Votre annonce</p>
            {openMission ? (
              <>
                <h3 className="mt-3 text-lg font-bold text-ink">{openMission.motif} · {shortRange(openMission.start, openMission.end)}</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="flex items-start gap-2 text-muted"><Stethoscope className="mt-0.5 h-4 w-4 text-brand" /> {openMission.activities}</p>
                  <p className="flex items-start gap-2 text-muted"><MapPin className="mt-0.5 h-4 w-4 text-brand" /> {openMission.cabinetAddress}</p>
                </div>
                <Link href={`/absences/${openMission.id}`} className="mt-5 block">
                  <Button variant="secondary" className="w-full">Voir les candidatures</Button>
                </Link>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-muted">Vous n’avez pas d’annonce ouverte.</p>
                <Link href="/absences/nouvelle" className="mt-4 block">
                  <Button className="w-full">Publier une absence</Button>
                </Link>
              </>
            )}
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
