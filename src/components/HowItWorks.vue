<script setup>
import { ref } from 'vue'

const role = ref('installe')

const steps = {
  installe: [
    { n: '01', title: 'Publiez votre besoin', text: 'Indiquez vos dates d’absence, le cabinet et la mission à confier. Seuls les remplaçants compatibles reçoivent une alerte.' },
    { n: '02', title: 'Échangez avec les candidats', text: 'Comparez les candidatures et préparez la mission dans la messagerie intégrée, sans partager vos coordonnées.' },
    { n: '03', title: 'Confirmez le remplacement', text: 'Les dates sont réservées dans vos deux calendriers. Votre cabinet reste accompagné.' },
  ],
  remplacant: [
    { n: '01', title: 'Créez votre profil', text: 'Renseignez votre spécialité, votre zone de mobilité et vos disponibilités, une seule fois.' },
    { n: '02', title: 'Recevez des alertes ciblées', text: 'Soyez notifié uniquement des missions qui correspondent à vos critères.' },
    { n: '03', title: 'Postulez et confirmez', text: 'Discutez avec le cabinet dans la messagerie, puis confirmez : la mission est réservée dans votre agenda.' },
  ],
}
</script>

<template>
  <section id="comment-ca-marche" class="scroll-mt-20 py-24">
    <div class="mx-auto max-w-6xl px-6">
      <div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div v-reveal>
          <p class="text-xs font-semibold tracking-widest text-brand-600 uppercase">Comment ça marche</p>
          <h2 class="mt-3 max-w-md text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Du besoin au relais, en trois étapes.
          </h2>
        </div>

        <div v-reveal class="relative grid grid-cols-2 self-start rounded-xl bg-slate-100 p-1.5 text-sm font-semibold">
          <span
            class="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-lg bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            :class="role === 'installe' ? 'translate-x-0' : 'translate-x-full'"
          />
          <button class="relative z-10 whitespace-nowrap rounded-lg px-6 py-2.5 transition-colors" :class="role === 'installe' ? 'text-ink' : 'text-slate-500'" @click="role = 'installe'">
            Médecin installé
          </button>
          <button class="relative z-10 whitespace-nowrap rounded-lg px-6 py-2.5 transition-colors" :class="role === 'remplacant' ? 'text-ink' : 'text-slate-500'" @click="role = 'remplacant'">
            Médecin remplaçant
          </button>
        </div>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <Transition
          v-for="(s, i) in steps[role]"
          :key="role + s.n"
          appear
          enter-active-class="transition duration-700 ease-out"
          enter-from-class="opacity-0 translate-y-6"
          enter-to-class="opacity-100 translate-y-0"
        >
          <article
            class="group rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            :class="i === 2 ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'border-slate-200 bg-white hover:border-brand-200'"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <p class="text-sm font-bold" :class="i === 2 ? 'text-blue-100' : 'text-brand-600'">{{ s.n }}</p>
            <h3 class="mt-6 text-xl font-bold">{{ s.title }}</h3>
            <p class="mt-3 leading-relaxed" :class="i === 2 ? 'text-blue-50' : 'text-slate-600'">{{ s.text }}</p>
          </article>
        </Transition>
      </div>
    </div>
  </section>
</template>
