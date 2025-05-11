<script setup>
import { motion, AnimatePresence } from "motion-v";
</script>
<template>
  <AnimatePresence>
    <motion.div class="min-w-90 fixed left-64">
      <div
        :class="[
          'h-screen w-64 flex flex-col justify-between px-6 py-8 bg-slate-900/80 border-r border-amber-500/10 backdrop-blur-md',
          'fixed top-0 left-0 z-40',
          'md:sticky md:!transform-none md:left-auto md:top-0 md:z-auto',
        ]"
        class="border-2 border-amber-200 flex flex-col min-w-full min-h-full items-center"
      >
        <div class="flex flex-col items-center gap-4 w-full">
          <h1
            class="cursor-pointer hidden md:block text-3xl font-extrabold text-amber-600 tracking-wide hover:text-amber-300 transition"
          >
            Notifications
          </h1>
          <div class="flex gap-4">
            <SidebarButton> Clear all </SidebarButton>
            <SidebarButton> Settings </SidebarButton>
          </div>
          <Notification />
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
</template>
