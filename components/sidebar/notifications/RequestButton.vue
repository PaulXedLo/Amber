<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  notificationId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["handleRequest"]);
const buttonVariants = {
  initial: { scale: 1.0 },
  whileHover: { scale: 1.05 },
};
import { motion } from "motion-v";
</script>
<template v-if="!loading">
  <motion.button
    @click="emit('handleRequest')"
    :variants="buttonVariants"
    initial="initial"
    whileHover="whileHover"
    :class="[
      name === 'Accept' ? 'bg-green-500' : '',
      name === 'Reject' ? 'bg-red-500' : '',
    ]"
    class="text-[12px] shadow-md cursor-pointer text-white p-1 rounded-md"
  >
    {{ name }}
  </motion.button>
</template>
