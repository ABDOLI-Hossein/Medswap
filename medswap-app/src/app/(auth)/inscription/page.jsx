"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Building2, Stethoscope } from "lucide-react";
import AuthCard from "../AuthCard";
import { Button, Field, Input } from "@/components/ui";
import { signup } from "@/app/actions";

const roles = [
  { id: "installe", label: "Médecin installé", text: "Je publie mes absences et choisis un remplaçant.", icon: Building2 },
  { id: "remplacant", label: "Médecin remplaçant", text: "Je consulte les missions et postule.", icon: Stethoscope },
];

export default function InscriptionPage() {
  const [state, action, pending] = useActionState(signup, null);
  const [role, setRole] = useState("remplacant");

  return (
    <AuthCard
      title="Créer mon compte"
      subtitle="Quelques informations pour commencer."
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <Link href="/connexion" className="font-semibold text-brand hover:underline">Se connecter</Link>
        </>
      }
    >
      <form action={action} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => {
            const on = role === r.id;
            const Icon = r.icon;
            return (
              <label key={r.id} className={`cursor-pointer rounded-xl border p-3 text-left transition-colors ${on ? "border-brand bg-brand-soft" : "border-line-strong hover:bg-surface"}`}>
                <input type="radio" name="role" value={r.id} checked={on} onChange={() => setRole(r.id)} className="sr-only" />
                <Icon className={`h-5 w-5 ${on ? "text-brand" : "text-muted"}`} />
                <p className="mt-2 text-sm font-semibold text-ink">{r.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">{r.text}</p>
              </label>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom"><Input name="firstName" required autoComplete="given-name" /></Field>
          <Field label="Nom"><Input name="lastName" required autoComplete="family-name" /></Field>
        </div>
        <Field label="Adresse e-mail"><Input name="email" type="email" required autoComplete="email" /></Field>
        <Field label="Mot de passe" hint="Au moins 6 caractères.">
          <Input name="password" type="password" required minLength={6} autoComplete="new-password" />
        </Field>
        {role === "installe" && (
          <>
            <Field label="Nom du cabinet"><Input name="cabinetName" placeholder="Cabinet des Brotteaux" /></Field>
            <Field label="Adresse du cabinet"><Input name="cabinetAddress" placeholder="24 rue Cuvier, 69006 Lyon" /></Field>
          </>
        )}
        {state?.error && <p role="alert" className="rounded-lg bg-amber-soft px-3 py-2 text-xs text-amber-ink">{state.error}</p>}
        <Button type="submit" className="mt-2 w-full" disabled={pending}>
          {pending ? "Création…" : "Créer mon compte"}
        </Button>
      </form>
    </AuthCard>
  );
}
