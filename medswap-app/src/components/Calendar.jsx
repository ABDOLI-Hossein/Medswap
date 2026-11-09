"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthNames } from "@/lib/data";

const weekDays = ["LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM.", "DIM."];

const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Grille du mois, semaine commençant le lundi. Chaque case a une date ISO. */
export function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = offset; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    cells.push({ day: d.getDate(), iso: iso(d.getFullYear(), d.getMonth(), d.getDate()), inMonth: false, weekend: d.getDay() % 6 === 0 });
  }
  for (let d = 1; d <= total; d++) {
    const dow = new Date(year, month, d).getDay();
    cells.push({ day: d, iso: iso(year, month, d), inMonth: true, weekend: dow === 0 || dow === 6 });
  }
  for (let n = 1; cells.length % 7 !== 0; n++) {
    const d = new Date(year, month + 1, n);
    cells.push({ day: d.getDate(), iso: iso(d.getFullYear(), d.getMonth(), d.getDate()), inMonth: false, weekend: d.getDay() % 6 === 0 });
  }
  return cells;
}

const toneStyles = {
  brand: { edge: "bg-brand text-white font-semibold", mid: "bg-brand-soft text-brand font-medium" },
  amber: { edge: "bg-amber-ink text-white font-semibold", mid: "bg-amber-soft text-amber-ink font-medium" },
  health: { edge: "bg-health text-white font-semibold", mid: "bg-health-soft text-health font-medium" },
  neutral: { edge: "bg-muted text-white font-semibold", mid: "bg-line-strong text-ink font-medium" },
};

/**
 * `marks` : [{ start: "2026-10-05", end: "2026-10-09", tone: "brand" | "amber" | "health" }]
 * `initial` : "YYYY-MM-DD" → mois affiché au départ.
 * `today` : "YYYY-MM-DD" → jour mis en évidence (passé par le serveur pour éviter les écarts d’hydratation).
 */
export default function Calendar({ marks = [], initial, today, showLegend = false }) {
  const start = initial ? new Date(initial) : new Date();
  const [view, setView] = useState({ year: start.getFullYear(), month: start.getMonth() });
  const cells = buildMonth(view.year, view.month);

  const shift = (delta) =>
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const markFor = (day) => marks.find((m) => day >= m.start && day <= m.end);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">{`${monthNames[view.month]} ${view.year}`}</p>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Mois précédent" onClick={() => shift(-1)} className="rounded-md p-1 text-muted hover:bg-surface hover:text-ink">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Mois suivant" onClick={() => shift(1)} className="rounded-md p-1 text-muted hover:bg-surface hover:text-ink">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 pb-1 text-center text-[10px] font-medium tracking-wide text-muted">
        {weekDays.map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((c) => {
          const m = c.inMonth ? markFor(c.iso) : undefined;
          const isEdge = m && (c.iso === m.start || c.iso === m.end);
          let tone = c.inMonth ? "text-ink" : "text-line-strong";
          if (c.inMonth && c.weekend && !m) tone = "bg-surface text-muted";
          if (m) tone = isEdge ? toneStyles[m.tone].edge : toneStyles[m.tone].mid;
          if (c.inMonth && today === c.iso) tone = "bg-ink text-white font-semibold";
          return (
            <span
              key={c.iso}
              className={`flex h-8 items-center justify-center text-xs ${m ? "rounded-md" : "mx-auto w-8 rounded-full"} ${tone}`}
            >
              {c.day}
            </span>
          );
        })}
      </div>

      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-3 text-xs text-muted">
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-brand" /> Réservé ou confirmé</span>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-amber-ink" /> À pourvoir</span>
        </div>
      )}
    </div>
  );
}
