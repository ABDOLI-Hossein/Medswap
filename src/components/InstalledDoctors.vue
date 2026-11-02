<script setup>
import AppIcon from './AppIcon.vue'

const days = ['Lun. 19', 'Mar. 20', 'Mer. 21', 'Jeu. 22', 'Ven. 23']

const features = [
  { icon: 'calendar', title: 'Tableau de bord et calendrier', text: 'Absences, remplacements confirmés et périodes à pourvoir, en un coup d’œil.' },
  { icon: 'search', title: 'Recherche de remplaçants', text: 'Filtrez par spécialité, ville et rayon ; voyez les disponibilités jour par jour.' },
  { icon: 'users', title: 'Comparaison des candidatures', text: 'Profil, expérience, disponibilité et documents de chaque candidat, côte à côte.' },
  { icon: 'lock', title: 'Motif d’absence privé', text: 'Le motif reste visible uniquement par vous. La diffusion est ciblée.' },
]

const doctors = [
  { initials: 'CM', name: 'Dr Claire Martin', meta: 'Médecin généraliste · Lyon 3e · 3 km', days: [true, true, true, true, true], label: '5 jours sur 5' },
  { initials: 'AD', name: 'Dr Antoine Dubois', meta: 'Médecin généraliste · Villeurbanne · 5 km', days: [true, true, true, true, true], label: '5 jours sur 5' },
  { initials: 'SB', name: 'Dr Sarah Benali', meta: 'Médecin généraliste · Bron · 9 km', days: [true, true, true, false, false], label: '3 jours sur 5' },
]
</script>

<template>
  <section id="medecins-installes" class="scroll-mt-20 bg-slate-50 py-24">
    <div class="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
      <div>
        <p v-reveal class="flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-600 uppercase">
          <AppIcon name="stethoscope" :size="16" /> Médecin installé
        </p>
        <h2 v-reveal class="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Gardez la main sur votre relais.
        </h2>
        <p v-reveal class="mt-5 max-w-md text-lg text-slate-600">
          Publiez vos absences, consultez les candidatures et choisissez votre remplaçant. Tout votre suivi au même endroit.
        </p>

        <ul class="mt-10 space-y-6">
          <li v-for="(f, i) in features" :key="f.title" v-reveal :style="{ '--delay': `${i * 100}ms` }" class="group flex gap-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-600 transition-all duration-300 group-hover:scale-110 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
              <AppIcon :name="f.icon" :size="18" />
            </span>
            <div>
              <h3 class="font-semibold text-ink">{{ f.title }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ f.text }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Carte mission : liste des médecins à proximité -->
      <div v-reveal class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] font-semibold tracking-wider text-brand-600 uppercase">Votre mission · 19 → 23 octobre</p>
            <p class="mt-1 font-bold text-ink">3 médecins à proximité</p>
          </div>
          <span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">À pourvoir</span>
        </div>

        <div class="mt-5 space-y-3">
          <div
            v-for="(d, i) in doctors"
            :key="d.name"
            v-reveal
            :style="{ '--delay': `${150 + i * 120}ms` }"
            class="rounded-xl border border-slate-100 p-4 transition-all duration-300 hover:border-brand-200 hover:shadow-md"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{{ d.initials }}</span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-ink">{{ d.name }}</p>
                <p class="text-xs text-slate-500">{{ d.meta }}</p>
              </div>
              <p class="text-xs font-medium text-slate-600">{{ d.label }}</p>
            </div>
            <div class="mt-3 grid grid-cols-5 gap-2">
              <span
                v-for="(on, j) in d.days"
                :key="j"
                class="rounded-lg py-1.5 text-center text-[11px] font-medium"
                :class="on ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-400 line-through'"
              >{{ days[j] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
