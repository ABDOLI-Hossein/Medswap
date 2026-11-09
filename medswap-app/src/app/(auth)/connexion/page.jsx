"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Mail, Lock } from "lucide-react";
import AuthCard from "../AuthCard";
import { Button, Field, Input } from "@/components/ui";
import { login } from "@/app/actions";

export default function ConnexionPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <AuthCard
      title="Se connecter"
      subtitle="Accédez à votre espace MedSwap."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-semibold text-brand hover:underline">Créer mon compte</Link>
        </>
      }
    >
      <form action={action} className="flex flex-col gap-4">
        <Field label="Adresse e-mail">
          <Input name="email" type="email" required autoComplete="email" placeholder="vous@exemple.fr" icon={Mail} />
        </Field>
        <Field label="Mot de passe">
          <Input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" icon={Lock} />
        </Field>
        {state?.error && <p role="alert" className="rounded-lg bg-amber-soft px-3 py-2 text-xs text-amber-ink">{state.error}</p>}
        <Button type="submit" className="mt-2 w-full" disabled={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </AuthCard>
  );
}
