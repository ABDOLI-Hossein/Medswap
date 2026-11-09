import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, CheckCheck, Lock, MapPin, CalendarDays, Stethoscope, FileText, MessageSquare, ArrowLeft, Clock, Home, Hand, Bell } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import Calendar from "@/components/Calendar";
import { Avatar, Badge, Button, Card, CardTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAbsence, listCandidaturesForAbsence, getCandidatureFor } from "@/lib/queries";
import { applyToAbsence, confirmCandidature, startConversation, publishDraft } from "@/app/actions";
import { shortRange, daysBetween, statusLabel, candidatureLabel } from "@/lib/mappers";

export default async function AbsencePage({ params }) {
  const { id } = await params;
  const user = await requireUser();
  const absence = getAbsence(Number(id));
  if (!absence) notFound();

  const isOwner = absence.ownerId === user.id;
  const isReplacer = absence.replacerId === user.id;
  if (!isOwner && !isReplacer && absence.status === "brouillon") notFound();

  const marks = [{ start: absence.start, end: absence.end, tone: absence.status === "confirmee" ? "brand" : absence.status === "publiee" ? "amber" : "neutral" }];
  const st = statusLabel[absence.status];
  const days = daysBetween(absence.start, absence.end);

  return (
    <AppShell breadcrumb={[isOwner ? "Mes absences" : "Trouver un remplacement", shortRange(absence.start, absence.end)]}>
      <PageHeader
        eyebrow={isOwner ? "Votre absence" : "Mission"}
        title={`${absence.motif} · ${shortRange(absence.start, absence.end)}`}
        description={`${absence.cabinetName} · ${absence.cabinetAddress}`}
        action={
          <div className="flex items-center gap-3">
            <Badge tone={st.tone}>{st.label}</Badge>
            {isOwner && absence.status === "brouillon" && (
              <>
                <Link href={`/absences/${absence.id}/modifier`}>
                  <Button variant="secondary">Modifier</Button>
                </Link>
                <form action={publishDraft.bind(null, absence.id)}>
                  <Button type="submit"><Bell className="h-4 w-4" /> Publier</Button>
                </form>
              </>
            )}
            <Link href={isOwner ? "/tableau-de-bord" : "/remplacant"}>
              <Button variant="secondary"><ArrowLeft className="h-4 w-4" /> Retour</Button>
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6">
          <Card>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <Detail icon={CalendarDays} label="Dates" value={`${shortRange(absence.start, absence.end)} · ${days} jours`} />
              <Detail icon={Stethoscope} label="Activité" value={absence.activities} />
              <Detail icon={Clock} label="Horaires" value={absence.schedule || "À convenir"} />
              <Detail icon={FileText} label="Rétrocession" value={absence.retrocession || "À convenir"} />
              <Detail icon={Home} label="Logement" value={absence.lodging} />
              <Detail icon={MapPin} label="Cabinet" value={absence.cabinetAddress || absence.cabinetName} />
            </div>
            {absence.notes && <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-muted">{absence.notes}</p>}
          </Card>

          {isOwner && absence.status === "publiee" && (
            <Card>
              <CardTitle>Candidatures reçues ({listCandidaturesForAbsence(absence.id).length})</CardTitle>
              <CandidatureList absence={absence} />
            </Card>
          )}

          {isOwner && absence.status === "confirmee" && (
            <Card>
              <CardTitle>Votre remplaçant</CardTitle>
              <ReplacerCard absence={absence} />
            </Card>
          )}

          {!isOwner && isReplacer && (
            <Card className="bg-brand-soft/60">
              <CardTitle>Votre mission est confirmée</CardTitle>
              <p className="text-sm leading-relaxed text-muted">
                Les dates sont réservées. Poursuivez l’échange avec {absence.ownerName} pour organiser la prise de relais.
              </p>
            </Card>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <Card>
            <CardTitle>Planning</CardTitle>
            <Calendar marks={marks} initial={absence.start} />
          </Card>

          {!isOwner && absence.status === "publiee" && <ApplyCard absenceId={absence.id} userId={user.id} />}

          {isOwner && (
            <Card>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                Le motif reste privé. Seules les coordonnées professionnelles sont partagées avec les candidats.
              </p>
            </Card>
          )}
        </aside>
      </div>
    </AppShell>
  );
}

function CandidatureList({ absence }) {
  const candidatures = listCandidaturesForAbsence(absence.id);
  if (candidatures.length === 0) {
    return <p className="py-6 text-center text-sm text-muted">Aucune candidature pour le moment. Les remplaçants compatibles ont été alertés.</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {candidatures.map((c) => {
        const st = candidatureLabel[c.status];
        return (
          <li key={c.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <Avatar initials={c.candidateInitials} tone="health" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{c.candidateName}</p>
              <p className="text-xs text-muted">{c.specialty} · {c.zone}</p>
              {c.message && <p className="mt-2 text-xs leading-relaxed text-muted">« {c.message} »</p>}
              <div className="mt-3 flex items-center gap-3">
                <Badge tone={st.tone}>{st.label}</Badge>
                <Link href={`/messagerie`} className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                  <MessageSquare className="h-3.5 w-3.5" /> Échanger
                </Link>
              </div>
            </div>
            <form action={confirmCandidature.bind(null, absence.id, c.id)}>
              <Button type="submit" className="px-3 py-2 text-xs">
                <Check className="h-3.5 w-3.5" /> Confirmer
              </Button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}

function ReplacerCard({ absence }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar initials={absence.replacerName.replace("Dr ", "").split(" ").map((p) => p[0]).join("")} size="lg" tone="health" />
        <div>
          <p className="text-sm font-semibold text-ink">{absence.replacerName}</p>
          <p className="flex items-center gap-1 text-xs text-muted"><CheckCheck className="h-3.5 w-3.5 text-brand" /> Mission confirmée</p>
        </div>
      </div>
      <form action={startConversation.bind(null, absence.replacerId)}>
        <Button type="submit" variant="secondary"><MessageSquare className="h-4 w-4" /> Contacter</Button>
      </form>
    </div>
  );
}

function ApplyCard({ absenceId, userId }) {
  const existing = getCandidatureFor(absenceId, userId);
  if (existing) {
    const st = candidatureLabel[existing.status];
    return (
      <Card className="border-brand-soft bg-brand-soft/60">
        <h2 className="text-base font-semibold text-ink">Votre candidature</h2>
        <div className="mt-3"><Badge tone={st.tone}>{st.label}</Badge></div>
        <p className="mt-3 text-xs leading-relaxed text-muted">Le médecin installé est notifié et peut vous répondre dans la messagerie.</p>
        <Link href="/remplacant/candidature" className="mt-4 block">
          <Button variant="secondary" className="w-full">Suivre ma candidature</Button>
        </Link>
      </Card>
    );
  }
  return (
    <Card className="border-brand-soft bg-brand-soft/60">
      <h2 className="text-base font-semibold text-ink">Cette mission vous intéresse ?</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted">Postulez en un clic. Le médecin installé reçoit votre profil et peut vous contacter.</p>
      <form action={applyToAbsence.bind(null, absenceId)} className="mt-4">
        <Button type="submit" className="w-full"><Hand className="h-4 w-4" /> Postuler à la mission</Button>
      </form>
    </Card>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
