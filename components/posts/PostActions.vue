<script setup lang="ts">
import type { Post } from "~/types/post";

defineProps<{
  postInfo: Post;
}>();

const emit = defineEmits<{
  (e: "like"): void;
  (e: "toggleComments"): void;
}>();
</script>

<template>
  <div class="flex gap-5 items-center w-full pb-3 border-b border-gray-800">
    <!-- Like Button -->
    <div
      class="flex items-center gap-2 cursor-pointer text-white hover:text-amber-400 transition-all"
      @click="emit('like')"
    >
      <Icon
        :name="postInfo.likedByMe ? 'noto:orange-heart' : 'noto:white-heart'"
        size="28"
      />
      <span class="text-sm font-medium">
        {{ postInfo.likesCount }}
      </span>
    </div>

    <!-- Comment Count -->
    <div
      class="flex items-center gap-2 cursor-pointer text-white hover:text-amber-400 transition-all"
      @click="emit('toggleComments')"
    >
      <Icon name="uil:comment" size="26" />
      <span class="text-sm font-medium">
        {{ postInfo.commentsCount }}
      </span>
    </div>
  </div>
</template>
