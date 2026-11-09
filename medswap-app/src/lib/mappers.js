// Transforme les lignes SQL en objets utilisables par l’interface.

export function initialsOf(first = "", last = "") {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function mapUser(row) {
  if (!row) return null;
  const prefs = JSON.parse(row.prefs ?? "{}");
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    name: `Dr ${row.first_name} ${row.last_name}`,
    shortName: `Dr ${row.last_name}`,
    initials: initialsOf(row.first_name, row.last_name),
    role: row.role,
    phone: row.phone,
    specialty: row.specialty,
    zone: row.zone,
    rpps: row.rpps,
    cabinetName: row.cabinet_name,
    cabinetAddress: row.cabinet_address,
    prefs: { alertes: true, messages: true, candidatures: true, marketing: false, ...prefs },
  };
}

export function isoToFr(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function shortRange(startIso, endIso) {
  const [, sm, sd] = startIso.split("-").map(Number);
  const [, em, ed] = endIso.split("-").map(Number);
  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  if (sm === em) return `${sd} → ${ed} ${months[em - 1]}`;
  return `${sd} ${months[sm - 1]} → ${ed} ${months[em - 1]}`;
}

export function daysBetween(startIso, endIso) {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const [ey, em, ed] = endIso.split("-").map(Number);
  return Math.round((Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) / 864e5) + 1;
}

/** Date du jour au format ISO local (YYYY-MM-DD). */
export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const statusLabel = {
  brouillon: { label: "Brouillon", tone: "neutral" },
  publiee: { label: "À pourvoir", tone: "warning" },
  confirmee: { label: "Confirmé", tone: "brand" },
};

export const candidatureLabel = {
  envoyee: { label: "Candidature envoyée", tone: "brand" },
  en_discussion: { label: "En discussion", tone: "warning" },
  confirmee: { label: "Confirmée", tone: "success" },
  refusee: { label: "Non retenue", tone: "neutral" },
};
