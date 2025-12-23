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
      class="fixed inset-0 z-50 overflow-y-auto bg-black/80"
    >
      <div
        class="flex min-h-full items-start md:items-center justify-center p-0 md:p-6"
      >
        <motion.div
          v-if="activePost"
          @click.stop
          :initial="{ scale: 0.95, opacity: 0 }"
          :animate="{ scale: 1, opacity: 1 }"
          class="flex flex-col md:flex-row w-full bg-slate-900 overflow-hidden relative md:max-w-6xl md:h-[90vh] md:rounded-2xl shadow-2xl min-h-full md:min-h-0"
        >
          <div
            class="md:hidden p-3 border-b border-gray-800 flex items-center bg-slate-900 sticky top-0 z-20"
          >
            <ModalHeader :post="activePost" />
          </div>

          <div
            class="w-full bg-black flex items-center justify-center md:w-auto md:flex-1 md:h-full"
          >
            <ModalImage
              :post="activePost"
              :fallbackImage="fallbackImage"
              class="max-h-[60vh] md:max-h-full object-contain"
            />
          </div>

          <div
            class="flex flex-col w-full bg-slate-900 md:w-[450px] md:h-full md:border-l md:border-gray-800"
          >
            <div class="hidden md:block p-4 border-b border-gray-800">
              <!--Modal header-->
              <ModalHeader :post="activePost" />
            </div>

            <div
              class="p-4 flex flex-col h-auto md:flex-1 md:overflow-y-auto custom-scrollbar"
            >
              <!-- Post description modal-->
              <ModalDescription />

              <div class="mt-4 mb-2 border-t border-gray-800 pt-4">
                <!--Modal like and comment section-->
                <ModalLikeAndComment :handleKeyPress="handleKeyPress" />
              </div>
              <!--Modal post comment seciton-->
              <ModalCommentSection />
            </div>

            <div class="h-20 md:hidden"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </AnimatePresence>
</template>
