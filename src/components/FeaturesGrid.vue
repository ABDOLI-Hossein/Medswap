<script setup>
import AppIcon from './AppIcon.vue'

const features = [
  { tag: 'Planification', title: 'Dates et disponibilités', text: 'Un calendrier clair pour publier vos absences ou déclarer vos disponibilités.', icon: 'calendar' },
  { tag: 'Diffusion', title: 'Alertes ciblées', text: 'Seuls les profils compatibles — spécialité, zone, période — sont notifiés.', icon: 'bell' },
  { tag: 'Recherche', title: 'Disponibilités jour par jour', text: 'Voyez qui est disponible sur toute la mission, ou sur une partie seulement.', icon: 'search' },
  { tag: 'Échanges', title: 'Messagerie sécurisée', text: 'Préparez la mission en toute confidentialité, coordonnées masquées au départ.', icon: 'message' },
  { tag: 'Conditions', title: 'Mission détaillée', text: 'Rôle, horaires, logiciel, rétrocession et logement : tout est clair avant de postuler.', icon: 'file' },
  { tag: 'Confirmation', title: 'Calendriers synchronisés', text: 'Une fois confirmé, le remplacement est réservé dans les deux calendriers.', icon: 'repeat' },
]
</script>

<template>
  <section id="fonctionnalites" class="scroll-mt-20 bg-slate-50 py-24">
    <div class="mx-auto max-w-6xl px-6">
      <p v-reveal class="text-xs font-semibold tracking-widest text-brand-600 uppercase">Fonctionnalités</p>
      <h2 v-reveal class="mt-3 max-w-xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Tout ce qu’il faut pour un relais serein.
      </h2>

      <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(f, i) in features"
          :key="f.title"
          v-reveal
          :style="{ '--delay': `${(i % 4) * 90}ms` }"
          class="group relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-100"
        >
          <div class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-50 transition-transform duration-500 group-hover:scale-[2.5]" />
          <div class="relative">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
              <AppIcon :name="f.icon" :size="18" />
            </span>
            <p class="mt-5 text-xs font-semibold tracking-wide text-brand-600 uppercase">{{ f.tag }}</p>
            <h3 class="mt-1 text-lg font-bold text-ink">{{ f.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ f.text }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
