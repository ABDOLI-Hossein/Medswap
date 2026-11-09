<script setup>
import AppIcon from './AppIcon.vue'
</script>

<template>
  <section id="top" class="relative overflow-hidden pt-32 pb-20 lg:pt-40">
    <!-- Halo animé en arrière-plan -->
    <div class="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-brand-100/60 blur-3xl animate-float" />
    <div class="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-50 blur-3xl animate-float-delayed" />

    <div class="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-28">
      <!-- Texte -->
      <div>
        <h1 class="animate-slide-intext-5xl leading-[1.05] font-extrabold tracking-tight text-ink sm:text-6xl lg:text-7xl" style="animation-delay: 120ms">
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

      <!-- Illustration -->
      <div class="animate-slide-in relative" style="animation-delay: 300ms">
        <img src="/brand/hero-poignee-de-main-transparent.png" alt="Deux médecins se serrent la main, calendrier validé" class="mx-auto w-full max-w-lg animate-float" />
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
