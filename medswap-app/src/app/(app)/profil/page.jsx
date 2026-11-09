import AppShell, { PageHeader } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { listAvailabilities } from "@/lib/queries";
import { ProfileForm, AvailabilityManager } from "./ProfileForms";

export default async function ProfilPage() {
  const user = await requireUser();
  const availabilities = listAvailabilities(user.id);

  return (
    <AppShell breadcrumb={["Mon profil"]}>
      <PageHeader eyebrow="Votre compte" title="Mon profil" description="Vos informations sont visibles par les personnes avec lesquelles vous échangez sur MedSwap." />
      <div className="mt-8 grid grid-cols-[1fr_360px] gap-6">
        <ProfileForm user={user} />
        {user.role === "remplacant" ? <AvailabilityManager availabilities={availabilities} /> : (
          <div className="rounded-2xl border border-line bg-white p-6 text-sm leading-relaxed text-muted">
            Les coordonnées de votre cabinet sont partagées avec les remplaçants lorsque vous publiez une absence.
          </div>
        )}
      </div>
    </AppShell>
  );
}
