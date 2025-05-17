<script setup>
import { motion } from "motion-v";
const route = useRoute();
const notFoundVariant = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};
const homeButtonVariant = {
  whileHover: { scale: 1.1 },
  whilePress: { scale: 0.9 },
};
</script>
<template>
  <motion.div
    :variants="notFoundVariant"
    initial="initial"
    animate="animate"
    class="flex flex-col justify-center gap-9 items-center min-h-200 overflow-y-hidden"
  >
    <h2 class="text-2xl font-semibold">Profile not found</h2>
    <p class="text-slate-400">
      The user @{{ route.params.username }} does not exist or there was an issue
      loading their profile.
    </p>
    <motion.button
      :variants="homeButtonVariant"
      whileHover="whileHover"
      whilePress="whilePress"
    >
      <NuxtLink
        to="/home"
        class="px-4 mt-5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow hover:shadow-lg"
      >
        Go home
      </NuxtLink>
    </motion.button>
  </motion.div>
</template>
