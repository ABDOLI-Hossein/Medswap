<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

const faqs = [
  { q: 'Qui peut utiliser MedSwap ?', a: 'Les médecins installés qui cherchent un remplaçant, et les médecins remplaçants qui cherchent des missions, partout en France.' },
  { q: 'Mes coordonnées sont-elles visibles ?', a: 'Non. Téléphone et e-mail personnels restent masqués au départ : les échanges se font dans la messagerie intégrée.' },
  { q: 'Qui reçoit mon annonce ?', a: 'Seuls les remplaçants compatibles avec votre spécialité, votre zone et toute la période sont notifiés. Les dates ne sont réservées qu’à la confirmation.' },
  { q: 'Combien coûte MedSwap ?', a: 'Demandez une démonstration pour découvrir l’offre adaptée à votre cabinet.' },
]

const openIndex = ref(0)
const toggle = (i) => (openIndex.value = openIndex.value === i ? -1 : i)
</script>

<template>
  <section id="faq" class="scroll-mt-20 py-24">
    <div class="mx-auto max-w-3xl px-6">
      <h2 v-reveal class="text-center text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Questions fréquentes</h2>

      <div class="mt-12 divide-y divide-slate-200 border-y border-slate-200">
        <div v-for="(f, i) in faqs" :key="f.q" v-reveal :style="{ '--delay': `${i * 80}ms` }">
          <button class="flex w-full items-center justify-between gap-4 py-5 text-left" :aria-expanded="openIndex === i" @click="toggle(i)">
            <span class="font-semibold text-ink">{{ f.q }}</span>
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300" :class="openIndex === i ? 'rotate-45 bg-brand-600 text-white' : ''">
              <AppIcon name="plus" :size="16" />
            </span>
          </button>
          <div class="grid transition-all duration-500 ease-out" :class="openIndex === i ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'">
            <p class="overflow-hidden text-slate-600 leading-relaxed">{{ f.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
