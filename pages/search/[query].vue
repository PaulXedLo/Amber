<script setup>
import LoadingSpinner from "~/components/LoadingSpinner.vue";
import { motion } from "motion-v";
definePageMeta({
  layout: "default",
});
const route = useRoute();
const { isLoading, clearSearch } = useSearch();
const { data: results } = await useFetch("/api/search", {
  query: { q: route.params.query },
});
const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
</script>
<template>
  <!--If no results-->
  <div
    v-if="results.length === 0"
    class="mt-10 min-h-150 py-10 flex justify-center items-center gap-6 flex-col"
  >
    <h1 class="text-2xl font-bold text-white">Search results</h1>
    <div>
      <div class="text-white text-center">
        No user found. Try a different name.
      </div>
    </div>
    <!--Go back home button-->
    <motion.button
      :whileHover="{ scale: 1.05 }"
      :whilePress="{ scale: 0.95 }"
      @click="
        async () => {
          await navigateTo('/home');
          clearSearch();
        }
      "
      class="px-5 py-2 cursor-pointer text-[13px] bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition shadow-md"
    >
      Go back home
    </motion.button>
  </div>
  <div v-else class="mt-10 px-4 md:px-0">
    <h1 class="text-2xl font-bold text-white text-center mb-6">
      Search results
    </h1>
    <div v-if="isLoading" class="flex justify-center">
      <LoadingSpinner />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!--List of search results-->
      <div
        v-for="user in results"
        :key="user.id"
        class="rounded-lg p-4 bg-slate-900/80 transition cursor-pointer"
        @click="
          async () => {
            await navigateTo(`/profile/${user.username}`);
            clearSearch();
          }
        "
      >
        <div class="flex items center gap-4">
          <img
            v-if="user.profilePicture"
            :src="user.profilePicture"
            alt="Profile Picture"
            class="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
          />
          <img
            v-else
            :src="fallbackImage"
            alt="Default Profile Picture"
            class="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
          />
          <div>
            <h2 class="text-lg font-semibold text-white">
              {{ user.fullName }}
            </h2>
            <p class="text-sm text-slate-400">@{{ user.username }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
