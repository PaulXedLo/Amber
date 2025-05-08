<template>
  <div
    class="flex min-h-screen min-w-screen bg-gradient-to-br from-purple-950 via-slate-900 to-amber-900"
  >
    <SideBar />
    <div class="flex-1 flex flex-col min-h-screen">
      <main class="p-4 w-full md:p-8 overflow-y-auto">
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
