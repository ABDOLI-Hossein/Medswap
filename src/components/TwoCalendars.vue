<script setup>
import AppIcon from './AppIcon.vue'
</script>

<template>
  <section class="relative overflow-hidden bg-brand-50/60 py-24 text-center">
    <div class="mx-auto max-w-6xl px-6">
      <p v-reveal class="text-xs font-semibold tracking-widest text-brand-600 uppercase">Un accord, deux calendriers</p>
      <h2 v-reveal class="mx-auto mt-3 max-w-2xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Confirmé d’un clic, réservé des deux côtés.
      </h2>
      <p v-reveal class="mx-auto mt-5 max-w-xl text-lg text-slate-600">
        Dès que vous confirmez votre remplaçant, la période est réservée dans votre calendrier et dans le sien.
      </p>

      <div class="mx-auto mt-14 grid max-w-3xl items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div v-reveal class="rounded-2xl bg-white p-5 text-left shadow-lg transition-transform duration-500 hover:-translate-y-1">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">AB</span>
            <div>
              <p class="text-sm font-semibold text-ink">Dr Alice Bernard</p>
              <p class="text-xs text-slate-500">Votre calendrier · Absence couverte</p>
            </div>
          </div>
          <p class="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">10 → 24 novembre · Confirmé</p>
        </div>

        <div v-reveal class="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/40">
          <span class="absolute inset-0 rounded-full bg-brand-600 animate-pulse-ring" />
          <AppIcon name="repeat" :size="22" class="relative" />
        </div>

        <div v-reveal style="--delay: 200ms" class="rounded-2xl bg-white p-5 text-left shadow-lg transition-transform duration-500 hover:-translate-y-1">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">CM</span>
            <div>
              <p class="text-sm font-semibold text-ink">Dr Claire Martin</p>
              <p class="text-xs text-slate-500">Calendrier du remplaçant · Mission réservée</p>
            </div>
          </div>
          <p class="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">10 → 24 novembre · Réservé</p>
        </div>
      </div>
    </div>
  </section>
</template>
