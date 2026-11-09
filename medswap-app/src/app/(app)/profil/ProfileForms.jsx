"use client";

import { useActionState, useEffect, useRef } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import { Button, Card, CardTitle, Field, Input, Select } from "@/components/ui";
import { updateProfile, addAvailability } from "@/app/actions";
import { removeAvailability } from "@/app/actions";
import { shortRange } from "@/lib/mappers";

export function ProfileForm({ user }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  return (
    <form action={action} className="flex flex-col gap-6">
      <Card>
        <CardTitle>Informations personnelles</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom"><Input name="firstName" defaultValue={user.firstName} required /></Field>
          <Field label="Nom"><Input name="lastName" defaultValue={user.lastName} required /></Field>
          <Field label="Téléphone"><Input name="phone" defaultValue={user.phone} type="tel" /></Field>
          <Field label="Adresse e-mail"><Input value={user.email} readOnly /></Field>
        </div>
      </Card>

      <Card>
        <CardTitle>{user.role === "installe" ? "Votre cabinet" : "Votre exercice"}</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Spécialité">
            <Select name="specialty" defaultValue={user.specialty}><option>Médecine générale</option><option>Pédiatrie</option><option>Psychiatrie</option></Select>
          </Field>
          <Field label="Zone géographique"><Input name="zone" defaultValue={user.zone} /></Field>
          {user.role === "remplacant" && (
            <div className="col-span-2"><Field label="Numéro RPPS" hint="Identifiant professionnel à 11 chiffres."><Input name="rpps" defaultValue={user.rpps} /></Field></div>
          )}
          {user.role === "installe" && (
            <>
              <Field label="Nom du cabinet"><Input name="cabinetName" defaultValue={user.cabinetName} /></Field>
              <Field label="Adresse du cabinet"><Input name="cabinetAddress" defaultValue={user.cabinetAddress} /></Field>
            </>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        {state?.ok ? <p role="status" className="rounded-lg bg-health-soft px-3 py-2 text-xs font-medium text-health">{state.message}</p> : <span />}
        <Button type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer le profil"}</Button>
      </div>
    </form>
  );
}

export function AvailabilityManager({ availabilities }) {
  const [state, action, pending] = useActionState(addAvailability, null);
  const formRef = useRef(null);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <Card>
      <CardTitle>Mes disponibilités</CardTitle>
      {availabilities.length === 0 ? (
        <p className="mb-4 text-sm text-muted">Aucune période déclarée.</p>
      ) : (
        <ul className="mb-5 divide-y divide-line">
          {availabilities.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-sm text-ink"><CalendarDays className="h-4 w-4 text-health" /> {shortRange(a.start, a.end)}</span>
              <form action={removeAvailability.bind(null, a.id)}>
                <button type="submit" aria-label="Supprimer cette période" className="rounded-md p-1.5 text-muted hover:bg-surface hover:text-amber-ink"><Trash2 className="h-4 w-4" /></button>
              </form>
            </li>
          ))}
        </ul>
      )}
      <form ref={formRef} action={action} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
        <Field label="Du"><Input name="start" type="date" required /></Field>
        <Field label="Au"><Input name="end" type="date" required /></Field>
        <Button type="submit" variant="secondary" disabled={pending}>Ajouter</Button>
      </form>
      {state?.error && <p role="alert" className="mt-3 text-xs text-amber-ink">{state.error}</p>}
    </Card>
  );
}
