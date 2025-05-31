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
      <CommonTooltip
        content="Display your age on your profile. It will be visible to other users."
      >
        <div
          class="bg-slate-700 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          <Icon name="twemoji:white-question-mark" size="15" />
        </div>
      </CommonTooltip>
    </div>
  </div>
</template>
