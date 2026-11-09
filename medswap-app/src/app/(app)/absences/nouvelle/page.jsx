import AppShell, { PageHeader } from "@/components/AppShell";
import { Badge } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import AbsenceForm from "@/components/AbsenceForm";

export default async function NouvelleAbsencePage() {
  await requireRole("installe");
  return (
    <AppShell breadcrumb={["Mes absences", "Nouvelle absence"]}>
      <PageHeader
        eyebrow="Publiez une mission"
        title="Publier une absence"
        description="Décrivez votre mission. Les candidats compatibles recevront une alerte à la publication."
        action={<Badge tone="brand">Brouillon</Badge>}
      />
      <AbsenceForm />
    </AppShell>
  );
}
