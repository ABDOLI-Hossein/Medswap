import Link from "next/link";
import { MessageSquare, CalendarDays } from "lucide-react";
import AppShell, { PageHeader } from "@/components/AppShell";
import { Badge, Button, Card } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { listCandidaturesForUser } from "@/lib/queries";
import { shortRange, candidatureLabel } from "@/lib/mappers";

export default async function CandidaturesPage() {
  const user = await requireRole("remplacant");
  const candidatures = listCandidaturesForUser(user.id);

  return (
    <AppShell breadcrumb={["Suivi des candidatures"]}>
      <PageHeader
        eyebrow="Vos candidatures"
        title="Suivi des candidatures"
        description="Retrouvez l’avancement de chacune de vos candidatures et échangez avec les médecins installés."
      />

      <div className="mt-8 flex flex-col gap-4">
        {candidatures.length === 0 && (
          <Card>
            <p className="py-8 text-center text-sm text-muted">Vous n’avez encore postulé à aucune mission.</p>
            <div className="flex justify-center">
              <Link href="/remplacant"><Button>Voir les missions ouvertes</Button></Link>
            </div>
          </Card>
        )}

        {candidatures.map((c) => {
          const st = candidatureLabel[c.status];
          return (
            <Card key={c.id} className="flex items-center gap-5 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{c.cabinetName} · {shortRange(c.start, c.end)}</p>
                <p className="mt-0.5 text-xs text-muted">{c.ownerName} · postulé le {c.createdAt.slice(0, 10)}</p>
                {c.message && <p className="mt-2 truncate text-xs text-muted">« {c.message} »</p>}
              </div>
              <Badge tone={st.tone}>{st.label}</Badge>
              <Link href={`/absences/${c.absenceId}`}>
                <Button variant="secondary" className="px-3 py-2 text-xs">Détail</Button>
              </Link>
              <Link href="/messagerie">
                <Button className="px-3 py-2 text-xs"><MessageSquare className="h-3.5 w-3.5" /> Échanger</Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
