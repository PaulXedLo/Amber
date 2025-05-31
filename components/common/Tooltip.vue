<script setup lang="ts">
import { motion } from "motion-v";

const props = defineProps<{
  content?: string;
}>();

const showTooltip = ref(false);

const tooltipVariant = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};
</script>

<template>
  <div
    class="relative inline-block"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <slot />

    <motion.div
      v-if="showTooltip"
      :variants="tooltipVariant"
      initial="hidden"
      animate="visible"
      class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 p-2 rounded-lg shadow-lg text-xs w-64 z-50"
    >
      {{ props.content || "Tooltip content here" }}
    </motion.div>
  </div>
</template>
