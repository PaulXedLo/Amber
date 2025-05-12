<template>
  <div
    class="flex min-h-screen max-w-screen bg-gradient-to-br from-[#400349] via-slate-900 to-amber-900"
  >
    <SideBar />
    <div class="mt-10 flex-1 w-full flex flex-col min-h-screen">
      <main class="p-4 md:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
div {
  font-family: Poppins, sans-serif;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-scroll-thumb);
  border-radius: 8px;
}
</style>
