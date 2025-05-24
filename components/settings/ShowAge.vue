<script setup lang="ts">
import { motion } from "motion-v";
const showTooltip = ref<boolean>(false);
const tooltipVariant = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};
</script>
<template>
  <div class="flex items-center gap-3 text-center relative">
    <CommonCheckboxButton type="showAge" />
    <div class="flex items-center gap-3 mt-4">
      <label for="showAge" class="text-l text-slate-100">
        Show age on profile
      </label>
      <div
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        class="rounded-full cursor-pointer bg-slate-900/80 opacity-50 border-2 w-5 h-5 flex items-center justify-center"
      >
        <Icon name="twemoji:white-question-mark" size="15" />
      </div>
      <motion.div
        v-if="showTooltip"
        :variants="tooltipVariant"
        initial="hidden"
        animate="visible"
        class="bg-slate-800 text-slate-200 p-2 rounded-lg shadow-lg z-10 text-[12px] absolute left-70 top-15 w-64"
      >
        This setting allows you to display your age on your profile. If enabled,
        your age will be visible to other users.
      </motion.div>
    </div>
  </div>
</template>
