<script setup>
const user = useUserStore();
async function signOut() {
  await user.signOut();
}
</script>
<template>
  <!-- Sidebar container -->
  <aside
    class="sticky top-0 h-screen w-64 hidden md:flex flex-col justify-between px-6 py-8 bg-slate-900/80 border-r border-amber-500/10 backdrop-blur-md"
  >
    <!-- Top: Logo and Navigation links -->
    <div class="flex flex-col gap-6 overflow-y-auto">
      <NuxtLink
        to="/home"
        class="text-2xl font-extrabold text-amber-400 tracking-wide hover:text-amber-300 transition"
      >
        Amber
      </NuxtLink>

      <nav class="flex flex-col gap-4 mt-10 text-slate-200">
        <NuxtLink
          to="/home"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:home-outline" size="20" /> Home
        </NuxtLink>
        <NuxtLink
          to="/uploadpost"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:upload-outline" size="20" /> Upload post
        </NuxtLink>
        <NuxtLink
          to="/explore"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:compass-outline" size="20" /> Explore
        </NuxtLink>

        <NuxtLink
          to="/profile/me"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:account-circle-outline" size="20" /> Profile
        </NuxtLink>

        <NuxtLink
          to="/profile/settings/profilesettings"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:cog-outline" size="20" /> Settings
        </NuxtLink>
      </nav>
    </div>

    <!-- Bottom: Logout -->
    <div class="text-slate-400 mt-8">
      <button
        @click="signOut"
        class="flex items-center gap-3 hover:text-red-400 transition"
      >
        <Icon name="mdi:logout" size="20" /> Logout
      </button>
    </div>
  </aside>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #fbbf24;
  border-radius: 8px;
}
</style>
