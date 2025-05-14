<script setup lang="ts">
import { motion } from "motion-v";
const props = defineProps({
  navigateLocation: {
    type: String,
    required: true,
    default: "",
  },
  iconName: {
    type: String,
    required: true,
    default: "",
  },
});
</script>
<template>
  <NuxtLink
    :to="props.navigateLocation"
    class="cursor-pointer flex p-2 items-center gap-3 hover:text-amber-400 transition"
  >
    <motion.div
      class="flex items-center gap-3"
      :whileHover="{ scale: 1.1 }"
      :whilePress="{ scale: 0.9 }"
    >
      <!-- ICON -->
      <Icon :name="props.iconName" size="35" /> <slot></slot>
    </motion.div>
  </NuxtLink>
</template>
