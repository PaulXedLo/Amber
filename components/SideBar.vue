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
    <div class="flex flex-col gap-1 overflow-y-auto text-center">
      <NuxtLink
        to="/home"
        class="text-4xl font-extrabold text-amber-400 tracking-wide hover:text-amber-300 transition"
      >
        Amber
      </NuxtLink>

      <nav class="flex flex-col gap-6 mt-10 text-slate-200">
        <NuxtLink
          to="/profile/me"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <NuxtImg
            :src="user.profilePic"
            class="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400"
          />
          My Profile
        </NuxtLink>

        <NuxtLink
          to="/home"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:home-outline" size="35" /> Home
        </NuxtLink>
        <NuxtLink
          to="/profile/settings/profilesettings"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:notifications" size="35" /> Notifications
        </NuxtLink>
        <NuxtLink
          to="/uploadpost"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:upload-outline" size="35" /> Upload post
        </NuxtLink>
        <NuxtLink
          to="/explore"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:compass-outline" size="35" /> Explore
        </NuxtLink>

        <NuxtLink
          to="/profile/settings/profilesettings"
          class="flex items-center gap-3 hover:text-amber-400 transition"
        >
          <Icon name="mdi:cog-outline" size="35" /> Settings
        </NuxtLink>
      </nav>
    </div>

    <!-- Bottom: Logout -->
    <div class="text-slate-400 mt-8">
      <button
        @click="signOut"
        class="flex items-center gap-3 hover:text-red-400 transition"
      >
        <Icon name="mdi:logout" size="40" /> Logout
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
