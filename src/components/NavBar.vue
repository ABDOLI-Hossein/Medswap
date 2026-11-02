<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'

const scrolled = ref(false)
const open = ref(false)

const links = [
  { label: 'Comment ça marche', href: '#comment-ca-marche' },
  { label: 'Médecins installés', href: '#medecins-installes' },
  { label: 'Remplaçants', href: '#remplacants' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'FAQ', href: '#faq' },
]

const onScroll = () => (scrolled.value = window.scrollY > 16)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-white/85 shadow-sm backdrop-blur-md' : 'bg-white/0'"
  >
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <a href="#top" class="group flex items-center gap-2 font-bold text-ink">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white transition-transform duration-300 group-hover:rotate-90">
          <AppIcon name="plus" :size="18" stroke-width="2.5" />
        </span>
        MedSwap
      </a>

      <ul class="hidden items-center gap-7 text-sm text-slate-600 lg:flex">
        <li v-for="l in links" :key="l.href">
          <a :href="l.href" class="relative py-1 transition-colors hover:text-brand-600 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 hover:after:scale-x-100">
            {{ l.label }}
          </a>
        </li>
      </ul>

      <div class="hidden items-center gap-4 lg:flex">
        <a href="#" class="text-sm font-medium text-slate-700 transition-colors hover:text-brand-600">Se connecter</a>
        <a href="#demo" class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/40">
          Demander une démo
        </a>
      </div>

      <button class="rounded-lg p-2 text-slate-700 lg:hidden" aria-label="Menu" @click="open = !open">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path v-if="!open" d="M3 6h18M3 12h18M3 18h18" />
          <path v-else d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </nav>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="open" class="border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
        <a v-for="l in links" :key="l.href" :href="l.href" class="block py-2 text-slate-700" @click="open = false">
          {{ l.label }}
        </a>
        <a href="#demo" class="mt-3 block rounded-lg bg-brand-600 px-4 py-2.5 text-center font-semibold text-white" @click="open = false">
          Demander une démo
        </a>
      </div>
    </Transition>
  </header>
</template>
