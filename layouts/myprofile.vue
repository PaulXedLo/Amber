<template>
  <div
    class="flex min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-amber-900 text-white"
  >
    <SideBar />
    <div class="flex-1 flex flex-col min-h-screen">
      <main class="p-4 md:p-8 overflow-y-hidden">
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
  background: #fbbf24;
  border-radius: 8px;
}
</style>
