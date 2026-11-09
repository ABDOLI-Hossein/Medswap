import AppShell, { PageHeader } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import SettingsForm from "./SettingsForm";

export default async function ParametresPage() {
  const user = await requireUser();
  return (
    <AppShell breadcrumb={["Paramètres"]}>
      <PageHeader eyebrow="Votre compte" title="Paramètres" description="Gérez vos informations, votre cabinet, votre mot de passe et vos notifications." />
      <div className="mt-8">
        <SettingsForm user={user} />
      </div>
    </AppShell>
  );
}
