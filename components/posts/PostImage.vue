<script setup lang="ts">
import type { Post } from "~/types/post";

defineProps<{
  postInfo: Post;
}>();
</script>

<template>
  <div
    v-if="postInfo.contentImage"
    class="w-full shadow-xl rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300"
  >
    <NuxtImg
      class="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
      :src="postInfo.contentImage"
      alt="Post image"
    />
  </div>
</template>
