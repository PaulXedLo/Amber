<script setup lang="ts">
import type { Notification } from "~/types/notification";
const props = defineProps<{
  name: string;
  senderId: Notification["senderId"];
  notificationId: Notification["id"];
}>();
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
