"use client";

import { useActionState } from "react";
import { Button, Card, CardTitle, Field, Input } from "@/components/ui";
import { updateSettings } from "@/app/actions";

const options = [
  { name: "alertes", label: "Alertes de nouvelles missions compatibles" },
  { name: "messages", label: "Nouveaux messages" },
  { name: "candidatures", label: "Nouvelles candidatures sur mes absences" },
  { name: "marketing", label: "Actualités et conseils MedSwap" },
];

export default function SettingsForm({ user }) {
  const [state, action, pending] = useActionState(updateSettings, null);
  return (
    <form action={action} className="grid grid-cols-[1fr_340px] gap-6">
      <div className="flex flex-col gap-6">
        <Card>
          <CardTitle>Informations personnelles</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prénom"><Input name="firstName" defaultValue={user.firstName} required /></Field>
            <Field label="Nom"><Input name="lastName" defaultValue={user.lastName} required /></Field>
            <Field label="Adresse e-mail"><Input value={user.email} readOnly /></Field>
            <Field label="Téléphone"><Input name="phone" defaultValue={user.phone} type="tel" /></Field>
          </div>
        </Card>

        {user.role === "installe" && (
          <Card>
            <CardTitle>Cabinet</CardTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nom du cabinet"><Input name="cabinetName" defaultValue={user.cabinetName} /></Field>
              <Field label="Adresse"><Input name="cabinetAddress" defaultValue={user.cabinetAddress} /></Field>
            </div>
          </Card>
        )}

        <Card>
          <CardTitle>Mot de passe</CardTitle>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Actuel"><Input name="currentPassword" type="password" autoComplete="current-password" /></Field>
            <Field label="Nouveau"><Input name="newPassword" type="password" autoComplete="new-password" placeholder="6 caractères minimum" /></Field>
            <Field label="Confirmer"><Input name="confirmPassword" type="password" autoComplete="new-password" /></Field>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardTitle>Notifications</CardTitle>
          <ul className="flex flex-col gap-4">
            {options.map((o) => (
              <li key={o.name}>
                <label className="flex cursor-pointer items-start justify-between gap-4">
                  <span className="text-sm text-ink">{o.label}</span>
                  <input type="checkbox" name={o.name} defaultChecked={user.prefs[o.name]} className="mt-1 h-4 w-4 accent-brand" />
                </label>
              </li>
            ))}
          </ul>
        </Card>

        {state?.error && <p role="alert" className="rounded-lg bg-amber-soft px-3 py-2 text-xs text-amber-ink">{state.error}</p>}
        {state?.ok && <p role="status" className="rounded-lg bg-health-soft px-3 py-2 text-center text-xs font-medium text-health">{state.message}</p>}
        <Button type="submit" className="w-full" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer les modifications"}</Button>
      </div>
    </form>
  );
}
