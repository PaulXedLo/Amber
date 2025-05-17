<script setup lang="ts">
import type { Post } from "@/types/post";
defineProps<{ postInfo: Post }>();
</script>

<template>
  <div class="w-full">
    <h3 class="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
      {{ postInfo.contentText }}
    </h3>
  </div>
</template>
