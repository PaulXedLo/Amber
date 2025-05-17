<script setup lang="ts">
import type { Post } from "~/types/post";

const { openModal } = useModal();
defineProps<{
  posts: Post[];
}>();
</script>
<template>
  <div
    v-if="posts && posts.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mt-10"
  >
    <div
      v-for="postItem in posts"
      :key="postItem.id"
      class="w-full aspect-square overflow-hidden rounded-lg bg-slate-800 shadow-md hover:shadow-amber-500/20 transition"
    >
      <NuxtImg
        :src="postItem.contentImage || ''"
        @click="openModal(postItem.id)"
        alt="Post image"
        class="w-full h-full object-cover cursor-pointer transform hover:scale-105 transition duration-300 hover:opacity-80"
        densities="x1"
        format="webp"
        quality="75"
        loading="lazy"
      />
    </div>
  </div>
</template>
