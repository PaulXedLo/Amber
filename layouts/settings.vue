<template>
  <div
    class="flex min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-amber-900 text-white"
  >
    <SideBar />
    <div class="flex-1 flex flex-col">
      <NavBar />
      <main class="flex-1 p-4 md:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
<style scoped>
div {
  font-family: Poppins, sans-serif;
}
</style>
