"use client";

import { useActionState, useState } from "react";
import { CalendarDays, Bell, Lock, MapPin, Stethoscope, Info, Save } from "lucide-react";
import Calendar from "@/components/Calendar";
import { Button, Card, CardTitle, Field, Input, Select } from "@/components/ui";
import { saveAbsence } from "@/app/actions";
import { daysBetween, shortRange } from "@/lib/mappers";

const activityOptions = ["Consultations", "Visites à domicile", "Gardes"];

export default function AbsenceForm({ absenceId = null, initial = {} }) {
  const [state, action, pending] = useActionState(saveAbsence.bind(null, absenceId), null);
  const [start, setStart] = useState(initial.start ?? "2026-11-10");
  const [end, setEnd] = useState(initial.end ?? "2026-11-24");
  const [activities, setActivities] = useState(initial.activities ? initial.activities.split(" · ") : ["Consultations"]);

  const valid = start && end && end >= start;
  const days = valid ? daysBetween(start, end) : 0;

  const toggle = (a) => setActivities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  return (
  <form action={action} className="mt-8 grid grid-cols-[1fr_360px] gap-6">
      <div className="flex flex-col gap-6">
        <Card>
          <CardTitle>La mission et le cabinet</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date de début" hint={valid ? `${days} jour${days > 1 ? "s" : ""} calendaire${days > 1 ? "s" : ""} · dates incluses` : "La fin doit être après le début"}>
              <Input name="start" type="date" required value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field label="Date de fin">
              <Input name="end" type="date" required value={end} onChange={(e) => setEnd(e.target.value)} />
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field label="Motif de l’absence">
              <Select name="motif" defaultValue={initial.motif ?? "Congés"}>
                <option>Congés</option>
                <option>Formation</option>
                <option>Maladie</option>
                <option>Autre</option>
              </Select>
            </Field>
            <Field label="Spécialité">
              <Select name="specialty" defaultValue={initial.specialty ?? "Médecine générale"}><option>Médecine générale</option></Select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Lieu du cabinet"><Input value="Cabinet de votre espace (modifiable dans Paramètres)" readOnly icon={MapPin} /></Field>
          </div>
        </Card>

        <Card>
          <CardTitle>Le rôle à confier</CardTitle>
          <div className="grid grid-cols-3 gap-3">
            {activityOptions.map((a) => {
              const on = activities.includes(a);
              return (
                <label key={a} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${on ? "border-brand bg-brand-soft text-brand" : "border-line-strong bg-white text-ink hover:bg-surface"}`}>
                  <input type="checkbox" name="activities" value={a} checked={on} onChange={() => toggle(a)} className="sr-only" />
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-brand bg-brand" : "border-line-strong"}`}>
                    {on && <span className="h-2 w-2 rounded-sm bg-white" />}
                  </span>
                  {a}
                </label>
              );
            })}
          </div>
          <div className="mt-4">
            <Field label="Organisation et planning">
              <Input name="schedule" defaultValue={initial.schedule ?? ""} placeholder="Ex. 9 h–12 h 30 · 14 h–18 h, du lundi au vendredi" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Précisions pour le remplaçant (facultatif)">
              <textarea name="notes" defaultValue={initial.notes ?? ""} rows={3} placeholder="Patientèle, équipe, logiciel, accès…" className="w-full resize-none rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardTitle>Conditions de mission · Facultatif</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rétrocession au remplaçant" hint="À confirmer avec le candidat retenu.">
              <Input name="retrocession" defaultValue={initial.retrocession ?? ""} placeholder="Ex. 80 % des honoraires" />
            </Field>
            <Field label="Logement">
              <Select name="lodging" defaultValue={initial.lodging ?? "Non proposé"}><option>Non proposé</option><option>Proposé</option></Select>
            </Field>
          </div>
        </Card>

        {state?.error && <p role="alert" className="rounded-lg bg-amber-soft px-4 py-3 text-sm text-amber-ink">{state.error}</p>}

        <div className="flex items-center justify-between">
          <Button type="submit" name="intent" value="draft" variant="secondary" disabled={pending}>
            <Save className="h-4 w-4" /> Enregistrer le brouillon
          </Button>
          <Button type="submit" name="intent" value="publish" disabled={pending || !valid || activities.length === 0}>
            <Bell className="h-4 w-4" /> {pending ? "Publication…" : "Publier la mission"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardTitle>Planning de la mission</CardTitle>
          <Calendar
            initial={start || "2026-11-01"}
            marks={valid ? [{ start, end, tone: "brand" }] : []}
          />
          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-sm bg-brand" />
            {valid ? `Période sélectionnée · ${shortRange(start, end)}` : "Choisissez une période valide"}
          </p>
        </Card>

        <Card className="border-brand-soft bg-brand-soft/60">
          <h2 className="text-base font-semibold text-ink">Résumé de la mission</h2>
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-brand uppercase">Aperçu avant diffusion</p>
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <p className="text-xs text-muted">Dates</p>
                <p className="text-sm font-medium text-ink">{valid ? shortRange(start, end) : "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Stethoscope className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <p className="text-xs text-muted">Rôle</p>
                <p className="text-sm font-medium text-ink">{activities.join(" · ") || "Aucun rôle sélectionné"}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex gap-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-semibold text-ink">Une diffusion ciblée</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Tous les remplaçants inscrits sont alertés à la publication. Les dates ne sont réservées qu’à la confirmation d’un candidat.
              </p>
            </div>
          </div>
        </Card>

        <p className="flex items-start gap-2 px-1 text-xs text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Le motif reste visible uniquement par vous.
        </p>
      </div>
    </form>
  );
}
