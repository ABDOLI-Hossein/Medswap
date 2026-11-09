import { notFound } from "next/navigation";
import AppShell, { PageHeader } from "@/components/AppShell";
import AbsenceForm from "@/components/AbsenceForm";
import { Badge } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { getAbsence } from "@/lib/queries";

export default async function ModifierAbsencePage({ params }) {
  const { id } = await params;
  const user = await requireRole("installe");
  const absence = getAbsence(Number(id));
  if (!absence || absence.ownerId !== user.id || absence.status !== "brouillon") notFound();

  return (
    <AppShell breadcrumb={["Mes absences", "Modifier le brouillon"]}>
      <PageHeader
        eyebrow="Brouillon"
        title="Modifier le brouillon"
        description="Ajustez votre mission puis publiez-la lorsqu’elle est prête."
        action={<Badge tone="neutral">Brouillon</Badge>}
      />
      <AbsenceForm
        absenceId={absence.id}
        initial={{
          start: absence.start,
          end: absence.end,
          motif: absence.motif,
          specialty: absence.specialty,
          activities: absence.activities,
          schedule: absence.schedule,
          retrocession: absence.retrocession,
          lodging: absence.lodging,
          notes: absence.notes,
        }}
      />
    </AppShell>
  );
}
