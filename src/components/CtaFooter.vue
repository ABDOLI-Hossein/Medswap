<template>
  <section id="demo" class="px-6 py-24">
    <div v-reveal class="group relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand-600 px-8 py-16 text-white shadow-2xl shadow-brand-600/30 sm:px-16">
      <div class="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-white/10 transition-transform duration-1000 group-hover:rotate-45" />
      <div class="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border-[30px] border-white/10 animate-float" />

      <div class="relative max-w-xl">
        <h2 class="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">Votre prochain relais commence ici.</h2>
        <p class="mt-4 text-lg text-blue-100">La continuité des soins commence par une bonne organisation.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#" class="rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">Demander une démonstration</a>
          <a href="#" class="rounded-xl border border-white/40 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10">Créer mon compte</a>
        </div>
      </div>
    </div>

    <footer class="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row">
      <div class="flex items-center gap-3">
        <img src="/brand/logo-horizontal-color.png" alt="MedSwap" class="h-7 w-auto" />
        <span>· Partout en France</span>
      </div>
      <nav class="flex gap-6">
        <a href="#" class="transition-colors hover:text-brand-600">Mentions légales</a>
        <a href="#" class="transition-colors hover:text-brand-600">Confidentialité</a>
        <a href="#" class="transition-colors hover:text-brand-600">Contacter l’équipe</a>
      </nav>
    </footer>
  </section>
</template>
