<script setup>
import { motion } from "motion-v";
</script>

<template>
  <motion.div
    class="fixed top-0 left-64 z-30 w-89 h-screen"
    :initial="{ x: '-100%', opacity: 0 }"
    :animate="{ x: 0, opacity: 1 }"
    :exit="{ x: '-100%', opacity: 0 }"
    :transition="{ duration: 0.3, ease: 'easeInOut' }"
  >
    <div
      class="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-md border-l border-amber-500/20"
    >
      <div class="px-4 pt-6 pb-4 border-b border-slate-700/50 flex-shrink-0">
        <h1
          class="text-2xl font-bold text-amber-500 tracking-tight mb-4 text-center"
        >
          Notifications
        </h1>
        <div class="flex justify-center gap-3">
          <SidebarButton size="sm"> Clear all </SidebarButton>
          <SidebarButton
            size="sm"
            :navigateLocation="'/profile/settings/notifications'"
          >
            Settings
          </SidebarButton>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto p-4 notification-list-area">
        <SidebarNotificationsNotification />
      </div>
    </div>
  </motion.div>
</template>

<style scoped>
.notification-list-area::-webkit-scrollbar {
  width: 6px;
}
.notification-list-area::-webkit-scrollbar-thumb {
  background-color: #fbbf24;
  border-radius: 3px;
}
.notification-list-area::-webkit-scrollbar-track {
  background-color: rgba(203, 213, 225, 0.1);
}
</style>
