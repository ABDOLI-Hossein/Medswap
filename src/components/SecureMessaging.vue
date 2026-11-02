<script setup>
import AppIcon from './AppIcon.vue'
</script>

<template>
  <section class="px-6 py-24">
    <div class="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-8 py-16 text-white sm:px-16">
      <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl animate-float" />

      <div class="relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p v-reveal class="flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-400 uppercase">
            <AppIcon name="lock" :size="16" /> Messagerie sécurisée
          </p>
          <h2 v-reveal class="mt-4 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
            Échangez d’abord dans MedSwap, sans partager vos coordonnées.
          </h2>
          <p v-reveal class="mt-5 max-w-md text-slate-300">
            Téléphone et e-mail personnels restent masqués au départ. Horaires, organisation du cabinet, rétrocession : tout se prépare en toute confidentialité.
          </p>
        </div>

        <div v-reveal class="rounded-2xl bg-white p-5 text-ink shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">CM</span>
              <div>
                <p class="text-sm font-semibold">Dr Claire Martin</p>
                <p class="text-xs text-slate-500">Médecin remplaçante · Lyon</p>
              </div>
            </div>
            <span class="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">En discussion</span>
          </div>

          <div class="mt-4 space-y-3 text-sm">
            <div v-reveal class="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 leading-relaxed">
              Bonjour Dr Bernard, je suis disponible du 10 au 24 novembre. Habituée aux cabinets de ville et à Doctolib.
            </div>
            <div v-reveal style="--delay: 250ms" class="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2.5 leading-relaxed text-white">
              Bonjour Claire ! Consultations de 9 h à 12 h 30 et de 14 h à 18 h. Secrétariat sur place, rétrocession 80 %.
            </div>
            <div v-reveal style="--delay: 500ms" class="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 leading-relaxed">
              Ces conditions me conviennent, je confirme ma disponibilité.
            </div>
          </div>

          <p v-reveal style="--delay: 700ms" class="mt-4 flex items-center justify-center gap-2 rounded-lg bg-slate-50 py-2 text-[11px] text-slate-500">
            <AppIcon name="lock" :size="12" /> Coordonnées personnelles masquées au départ
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
