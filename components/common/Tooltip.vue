<script setup lang="ts">
import { motion } from "motion-v";

const props = defineProps<{
  content?: string;
}>();

const showTooltip = ref(false);

const tooltipVariant = {
  hidden: { opacity: 0, y: -5, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

function toggleTooltip() {
  showTooltip.value = !showTooltip.value;
}
</script>

<template>
  <div
    class="relative inline-block"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @click="toggleTooltip"
  >
    <slot />

    <AnimatePresence>
      <motion.div
        v-if="showTooltip"
        :variants="tooltipVariant"
        initial="hidden"
        animate="visible"
        exit="hidden"
        class="absolute bottom-full mb-2 z-50 p-3 rounded-lg shadow-xl bg-slate-800 text-slate-200 text-xs leading-relaxed border border-slate-700
               w-48 md:w-64
               right-[-10px] md:right-auto md:left-1/2 
               md:-translate-x-1/2"
      >
        <div 
            class="absolute -bottom-1 w-2 h-2 bg-slate-800 border-r border-b border-slate-700 transform rotate-45
                   right-4 md:right-auto md:left-1/2 md:-translate-x-1/2"
        ></div>

        {{ props.content || "Tooltip content" }}
      </motion.div>
    </AnimatePresence>
  </div>
</template>