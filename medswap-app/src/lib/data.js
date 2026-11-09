// Données de démonstration issues de la maquette Figma.

export const medecin = {
  initials: "AB",
  name: "Dr Alice Bernard",
  role: "Médecin installée",
  cabinet: "Cabinet des Brotteaux",
  city: "Lyon · Médecine générale",
};

export const remplacant = {
  initials: "CM",
  name: "Dr Claire Martin",
  role: "Médecin remplaçant",
  city: "Lyon · Médecine générale",
};

export const candidats = [
  {
    id: "claire",
    initials: "CM",
    name: "Dr Claire Martin",
    meta: "Médecin généraliste · Lyon 3e · 3 km",
    experience: "8 ans d’exercice · Cabinet de ville · Logiciel Doctolib",
    days: [
      { label: "Lun. 19", ok: true },
      { label: "Mar. 20", ok: true },
      { label: "Mer. 21", ok: true },
      { label: "Jeu. 22", ok: true },
      { label: "Ven. 23", ok: true },
    ],
    updated: "Disponibilités mises à jour aujourd’hui",
    tag: "5 jours sur 5",
  },
  {
    id: "antoine",
    initials: "AD",
    name: "Dr Antoine Dubois",
    meta: "Médecin généraliste · Villeurbanne · 5 km",
    experience: "6 ans d’exercice · Médecine de famille · Visites à domicile",
    days: [
      { label: "Lun. 19", ok: true },
      { label: "Mar. 20", ok: true },
      { label: "Mer. 21", ok: true },
      { label: "Jeu. 22", ok: true },
      { label: "Ven. 23", ok: true },
    ],
    updated: "Disponibilités mises à jour il y a 2 jours",
    tag: "5 jours sur 5",
  },
  {
    id: "sarah",
    initials: "SB",
    name: "Dr Sarah Benali",
    meta: "Médecin généraliste · Bron · 9 km",
    experience: "5 ans d’exercice · Cabinet de groupe · Logiciel Doctolib",
    days: [
      { label: "Lun. 19", ok: true },
      { label: "Mar. 20", ok: true },
      { label: "Mer. 21", ok: true },
      { label: "Jeu. 22", ok: false },
      { label: "Ven. 23", ok: false },
    ],
    updated: "Disponibilités mises à jour il y a 2 jours",
    tag: "3 jours sur 5",
  },
];

export const conversations = [
  { id: "claire", initials: "CM", name: "Claire Martin", meta: "19 – 23 oct. · Lyon", time: "09:24", last: "Oui, je suis disponible les 5 jours.", unread: true },
  { id: "julien", initials: "JM", name: "Julien Moreau", meta: "5 – 9 oct. · Lyon", time: "08:42", last: "Bien arrivé au cabinet, merci !", unread: true },
  { id: "emma", initials: "EL", name: "Emma Laurent", meta: "23 – 27 nov. · Lyon", time: "Ven.", last: "Parfait, à bientôt Dr Bernard.", unread: false },
  { id: "thomas", initials: "TP", name: "Thomas Petit", meta: "Discussion générale · Nantes", time: "1 oct.", last: "Merci pour votre retour.", unread: false },
];

export const messagesClaire = [
  { from: "me", text: "Bonjour Claire, je recherche un remplacement du 19 au 23 octobre à Lyon. Seriez-vous disponible sur cette période ?", time: "09:12 · Lu" },
  { from: "them", text: "Bonjour Dr Bernard ! Oui, je suis disponible. Pourriez-vous me préciser les horaires et l’organisation du cabinet ?", time: "09:18" },
  { from: "me", text: "Bien sûr : 9 h–12 h 30 et 14 h–18 h, du lundi au vendredi. Le secrétariat est sur place et nous utilisons Doctolib. Pas de garde prévue.", time: "09:21 · Lu" },
  { from: "them", text: "Cela me convient très bien. Je vous confirme ma disponibilité pour les 5 jours. Je serais ravie d’échanger sur la mission !", time: "09:24" },
];

export const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
