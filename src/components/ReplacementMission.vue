<script setup>
import AppIcon from './AppIcon.vue'

const features = [
  { title: 'Profil en 3 étapes', text: 'Profil et activité, documents, disponibilités.' },
  { title: 'Votre rayon de mobilité', text: 'Des missions dans la zone que vous choisissez.' },
  { title: 'Suivi des candidatures', text: 'Envoyée, en discussion, confirmée : tout est clair.' },
  { title: 'Licence jointe au profil', text: 'Votre document est prêt à être partagé avec le cabinet.' },
]
</script>

<template>
  <section id="remplacants" class="scroll-mt-20 py-24">
    <div class="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
      <!-- Carte mission -->
      <div class="relative order-2 lg:order-1">
        <div v-reveal class="mb-4 flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-white shadow-lg">
          <span class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <span class="absolute h-8 w-8 rounded-lg border border-brand-400 animate-pulse-ring" />
            <AppIcon name="bell" :size="16" />
          </span>
          <div>
            <p class="text-sm font-semibold">Une nouvelle mission compatible vient d’être publiée</p>
            <p class="text-xs text-slate-300">Spécialité, zone et dates correspondent à votre profil.</p>
          </div>
        </div>

        <div v-reveal class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 transition-transform duration-500 hover:-translate-y-1">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-lg font-bold text-ink">Mission à Lyon</p>
              <p class="text-sm text-slate-500">Cabinet des Brotteaux · Lyon 6e · 3 km</p>
            </div>
            <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Compatible</span>
          </div>

          <div class="mt-5 grid grid-cols-3 gap-3">
            <div v-for="b in [{ l: 'Dates', v: '10 → 24 nov.' }, { l: 'Activité', v: 'Consultations' }, { l: 'Rétrocession', v: '80 % · sans logement' }]" :key="b.l" class="rounded-xl bg-slate-50 p-3">
              <p class="text-[11px] text-slate-500">{{ b.l }}</p>
              <p class="mt-0.5 text-sm font-semibold text-ink">{{ b.v }}</p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="t in ['Médecine générale', 'Lyon + 30 km', 'Période complète']" :key="t" class="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">✓ {{ t }}</span>
          </div>

          <button class="mt-6 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 active:scale-[0.98]">
            Postuler à la mission
          </button>
        </div>
      </div>

      <div class="order-1 lg:order-2">
        <div v-reveal class="mb-6 h-44 w-44 overflow-hidden rounded-full"><img src="/brand/persona-remplacant.png" alt="Médecin remplaçant" class="h-full w-full origin-center scale-[1.08] object-cover" /></div>
        <p v-reveal class="flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-600 uppercase">
          <AppIcon name="users" :size="16" /> Médecin remplaçant
        </p>
        <h2 v-reveal class="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Des missions selon vos envies.
        </h2>
        <p v-reveal class="mt-5 text-lg text-slate-600">
          Renseignez votre profil, votre zone et vos disponibilités. Recevez des alertes compatibles et postulez aux missions qui vous correspondent.
        </p>

        <div class="mt-10 grid gap-4 sm:grid-cols-2">
          <div v-for="(f, i) in features" :key="f.title" v-reveal :style="{ '--delay': `${i * 100}ms` }" class="rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
            <h3 class="font-semibold text-ink">{{ f.title }}</h3>
            <p class="mt-1 text-sm text-slate-600">{{ f.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
