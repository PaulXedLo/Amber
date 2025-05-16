<script setup lang="ts">
import { motion, AnimatePresence } from "motion-v";
import { useModal } from "@/composables/useModal";

const {
  isOpen,
  activePost,
  commentInput,
  handleAddComment,
  fallbackImage,
  closeModal,
} = useModal();

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "Enter") handleAddComment();
  if (e.key === "Escape") closeModal();
  if (e.key === "Tab") {
    e.preventDefault();
    commentInput.value = "";
  }
};
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0, transition: { duration: 0.15 } }"
      class="fixed inset-0 z-50 p-4 sm:p-6 md:p-10 flex items-center justify-center bg-black/70"
    >
      <motion.div
        v-if="activePost"
        :initial="{ scale: 0.2 }"
        :animate="{
          scale: 1.0,
          opacity: 1,
          transition: { duration: 0.25, ease: 'easeOut' },
        }"
        class="flex flex-col md:flex-row w-full h-full md:max-w-5xl md:h-[90vh] rounded-2xl overflow-hidden bg-slate-900"
      >
        <!-- MODAL IMAGE -->
        <ModalImage :post="activePost" :fallbackImage="fallbackImage" />
        <!-- Info Section -->
        <div
          class="w-full md:w-[400px] lg:w-[450px] flex flex-col p-4 md:p-6 gap-4 text-white bg-slate-900"
        >
          <!-- Header -->
          <ModalHeader :post="activePost" />

          <!-- Description -->
          <ModalDescription />

          <!-- Like & Comment Input -->
          <ModalLikeAndComment :handleKeyPress="handleKeyPress" />

          <!-- Comments Section -->
          <ModalCommentSection />
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
</template>
