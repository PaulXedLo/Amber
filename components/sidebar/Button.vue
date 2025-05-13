<script setup lang="ts">
import { motion } from "motion-v";
const { unreadNotifications } = useNotifications();
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
      :class="{ relative: props.iconName === 'mdi:notifications' }"
      class="flex items-center gap-3"
      :whileHover="{ scale: 1.1 }"
      :whilePress="{ scale: 0.9 }"
    >
      <!-- ICON -->
      <Icon :name="props.iconName" size="35" /> <slot></slot>
      <span
        v-if="
          props.iconName === 'mdi:notifications' && unreadNotifications >= 1
        "
        class="rounded-full w-3 h-3 bg-amber-500"
      >
      </span>
    </motion.div>
  </NuxtLink>
</template>
