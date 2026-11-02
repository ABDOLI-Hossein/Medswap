<script setup>
import AppIcon from './AppIcon.vue'

const days = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.']
const cells = [
  [28, 29, 30, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 1],
]
const isOther = (n, row) => (row === 0 && n > 20) || (row === 4 && n < 10)
</script>

<template>
  <section id="top" class="relative overflow-hidden pt-32 pb-20 lg:pt-40">
    <!-- Halo animé en arrière-plan -->
    <div class="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-brand-100/60 blur-3xl animate-float" />
    <div class="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-50 blur-3xl animate-float-delayed" />

    <div class="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
      <!-- Texte -->
      <div>
        <span class="animate-slide-in inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold tracking-wide text-brand-700 uppercase" style="animation-delay: 0ms">
          <span class="h-1.5 w-1.5 rounded-full bg-brand-600 animate-pulse" />
          Nouveau · Remplacements médicaux partout en France
        </span>

        <h1 class="animate-slide-in mt-6 text-5xl leading-[1.05] font-extrabold tracking-tight text-ink sm:text-6xl lg:text-7xl" style="animation-delay: 120ms">
          Vos remplacements médicaux,
          <span class="text-shimmer">simplement.</span>
        </h1>

        <p class="animate-slide-in mt-6 max-w-lg text-lg leading-relaxed text-slate-600" style="animation-delay: 240ms">
          Préparez la continuité des soins sans compliquer votre organisation. MedSwap réunit médecins installés et remplaçants, des dates au relais.
        </p>

        <div class="animate-slide-in mt-8 flex flex-wrap gap-3" style="animation-delay: 360ms">
          <a href="#demo" class="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl">
            Publier une absence
            <AppIcon name="arrow" :size="18" class="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a href="#remplacants" class="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-600 hover:text-brand-600">
            Je suis remplaçant
          </a>
        </div>

        <ul class="animate-slide-in mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600" style="animation-delay: 480ms">
          <li v-for="t in ['Coordonnées masquées', 'Alertes ciblées', 'Calendriers synchronisés']" :key="t" class="flex items-center gap-1.5">
            <AppIcon name="check" :size="16" class="text-brand-600" stroke-width="2.5" />
            {{ t }}
          </li>
        </ul>
      </div>

      <!-- Maquette calendrier -->
      <div class="animate-slide-in relative" style="animation-delay: 300ms">
        <div class="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/50">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 text-sm text-slate-500">
            <span>Espace médecin › <strong class="text-ink">Tableau de bord</strong></span>
            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">AB</span>
          </div>

          <div class="mt-4 grid grid-cols-3 gap-3">
            <div v-for="s in [{ n: 3, l: 'Périodes d’absence', c: 'text-ink' }, { n: 2, l: 'Remplacements confirmés', c: 'text-brand-600' }, { n: 1, l: 'Période à pourvoir', c: 'text-amber-700' }]" :key="s.l" class="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-2xl font-extrabold" :class="s.c">{{ s.n }}</p>
              <p class="text-[11px] leading-tight text-slate-500">{{ s.l }}</p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-100 p-3">
            <div class="mb-2 flex justify-between text-xs">
              <span class="font-semibold text-ink">Vos absences &amp; remplacements</span>
              <span class="text-slate-400">Octobre 2026</span>
            </div>
            <div class="grid grid-cols-7 gap-y-1 text-center text-[10px] text-slate-400">
              <span v-for="d in days" :key="d" class="py-1 uppercase">{{ d }}</span>
              <template v-for="(row, r) in cells" :key="r">
                <span
                  v-for="(n, c) in row"
                  :key="`${r}-${c}`"
                  class="py-1.5 text-xs"
                  :class="[
                    isOther(n, r) ? 'text-slate-300' : 'text-slate-700',
                    n === 5 && r === 1 ? 'mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 font-bold text-white' : '',
                  ]"
                >{{ n }}</span>
              </template>
            </div>
            <div class="mt-2 space-y-1.5">
              <div class="animate-slide-in rounded-md bg-brand-50 px-2 py-1.5 text-[11px] font-medium text-brand-700" style="animation-delay: 900ms">
                5–9 oct. · Dr Julien Moreau · <span class="font-bold">Confirmé</span>
              </div>
              <div class="animate-slide-in rounded-md bg-amber-50 px-2 py-1.5 text-[11px] font-medium text-amber-800" style="animation-delay: 1050ms">
                19–23 oct. · Congés · Remplaçant recherché
              </div>
            </div>
          </div>

          <!-- Badge flottant -->
          <div class="absolute -top-4 right-4 flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs font-medium text-white shadow-lg animate-float">
            <AppIcon name="check" :size="14" stroke-width="2.5" class="text-emerald-400" />
            Confirmé dans les deux calendriers
          </div>
        </div>

        <!-- Notification flottante -->
        <div class="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 pr-5 shadow-xl animate-float-delayed sm:-left-10">
          <span class="relative flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <AppIcon name="bell" :size="18" />
            <span class="absolute inset-0 rounded-lg border border-brand-400 animate-pulse-ring" />
          </span>
          <div>
            <p class="text-xs font-semibold text-ink">Nouvelle mission compatible</p>
            <p class="text-[11px] text-slate-500">Lyon · 10 → 24 novembre</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bandeau de fonctionnalités -->
    <div class="mx-auto mt-24 grid max-w-6xl grid-cols-2 gap-3 px-6 lg:grid-cols-4">
      <div
        v-for="(f, i) in [
          { icon: 'calendar', label: 'Dates et disponibilités' },
          { icon: 'bell', label: 'Alertes ciblées' },
          { icon: 'message', label: 'Messagerie intégrée' },
          { icon: 'pin', label: 'Partout en France' },
        ]"
        :key="f.label"
        v-reveal
        :style="{ '--delay': `${i * 90}ms` }"
        class="group flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-800 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
      >
        <AppIcon :name="f.icon" :size="18" class="text-brand-600 transition-transform duration-300 group-hover:scale-110" />
        {{ f.label }}
      </div>
    </div>
  </section>
</template>
