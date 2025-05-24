<script setup lang="ts">
import { motion } from "motion-v";
const user = useUserStore();
const { toggleShareModal } = useShareModal();
</script>
<template>
  <div class="flex gap-6 mt-2">
    <motion.button :whileHover="{ scale: 1.05 }" :whilePress="{ scale: 0.95 }">
      <NuxtLink
        to="/profile/settings/profilesettings"
        class="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow hover:shadow-lg"
      >
        Edit Profile
      </NuxtLink>
    </motion.button>
    <motion.button
      @click="toggleShareModal(user.userId as string)"
      :whileHover="{ scale: 1.05 }"
      :whilePress="{ scale: 0.95 }"
      class="cursor-pointer px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
    >
      Share Profile
    </motion.button>
  </div>
</template>
