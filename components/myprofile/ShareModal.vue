<script setup lang="ts">
import { motion } from "motion-v";
const {
  showShareModal,
  activeProfileId,
  shareText,
  shareTitle,
  shareUrl,
  shareImage,
  isCopied,
  shareDescription,
  copyShareUrl,
  toggleShareModal,
} = useShareModal();
</script>

<template>
  <motion.div
    v-if="showShareModal"
    role="dialog"
    aria-modal="true"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0, transition: { duration: 0.2 } }"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-80 backdrop-blur-sm"
    @click.self="toggleShareModal"
  >
    <motion.div
      v-if="activeProfileId"
      :initial="{ scale: 0.5, opacity: 0 }"
      :animate="{
        scale: 1,
        opacity: 1,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }"
      :exit="{ scale: 0.5, opacity: 0 }"
      class="relative flex flex-col md:flex-row w-full max-w-sm md:max-w-3xl h-auto md:h-[450px] bg-slate-900 rounded-3xl shadow-2xl shadow-black/50 border border-slate-700/60 overflow-hidden"
    >
      <div
        class="relative w-full md:w-2/5 flex items-center justify-center p-8 md:p-10 bg-slate-800/50 md:border-r border-slate-700/60"
      >
        <div
          class="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center ring-4 ring-amber-500 ring-offset-4 ring-offset-slate-800 rounded-full overflow-hidden shadow-lg shadow-black/30"
        >
          <NuxtImg
            :src="shareImage"
            alt="Profile image"
            class="w-full h-full object-cover"
            placeholder
          />
        </div>
        <div
          class="absolute inset-0 -z-10 opacity-5 [mask-image:radial-gradient(closest-side,white,transparent)]"
        ></div>
      </div>

      <div
        class="flex flex-col w-full md:w-3/5 p-8 md:p-10 text-center md:text-left justify-between"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <h2
              class="text-2xl md:text-3xl font-bold text-white tracking-tight"
            >
              {{ shareTitle }}
            </h2>
            <p class="text-lg text-slate-400 mt-1 italic">
              "{{ shareDescription }}"
            </p>
          </div>
          <h3
            class="text-md text-slate-300 mt-4 font-light border-l-2 border-amber-500 pl-3"
          >
            {{ shareText }}
          </h3>

          <div class="mt-6">
            <label
              for="share-url-styled"
              class="block text-xs font-medium text-slate-500 mb-1"
              >Your Shareable Link:</label
            >

            <div class="relative w-full">
              <input
                id="share-url-styled"
                v-model="shareUrl"
                type="text"
                class="w-full pl-4 pr-12 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition placeholder:text-slate-600"
                readonly
              />
              <button
                @click="copyShareUrl"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-amber-400 transition duration-200 cursor-pointer p-1 rounded-md hover:bg-slate-700/50"
                aria-label="Copy Link"
                title="Copy Link"
              >
                <Icon
                  name="i-heroicons-clipboard-document-check-20-solid"
                  class="w-5 h-5 text-green-500"
                  v-if="isCopied"
                />
                <Icon name="i-heroicons-link-20-solid" class="w-5 h-5" v-else />
              </button>
            </div>
          </div>
        </div>

        <p class="text-center text-slate-600 text-xs mt-10 md:mt-0">
          &copy; {{ new Date().getFullYear() }} AMBER. All rights reserved.
        </p>
      </div>

      <button
        @click="toggleShareModal"
        class="cursor-pointer absolute top-4 right-4 text-slate-500 hover:text-amber-400 transition duration-200 z-10 p-1.5 rounded-full bg-slate-800/60 hover:bg-slate-700"
        aria-label="Close"
      >
        <Icon name="i-heroicons-x-mark-20-solid" class="w-5 h-5" />
      </button>
    </motion.div>
  </motion.div>
</template>

<style scoped>
input[readonly] {
  cursor: default;
}
</style>
