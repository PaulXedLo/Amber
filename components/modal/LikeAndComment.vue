<script setup lang="ts">
const { commentInput, activePost, handleAddComment, handleLikePost } =
  useModal();
defineProps<{
  handleKeyPress: (e: KeyboardEvent) => void;
}>();
</script>
<template>
  <div class="flex items-center gap-4 mt-2">
    <button
      @click="async () => await handleLikePost()"
      class="flex cursor-pointer items-center gap-1 text-white hover:text-amber-400"
      aria-label="Toggle like"
    >
      <Icon
        :name="
          activePost?.posts.likedByMe
            ? 'noto:yellow-heart'
            : 'mdi:heart-outline'
        "
        size="28"
      />
      <span class="text-sm">{{ activePost?.posts.likesCount }}</span>
    </button>
    <input
      v-model="commentInput"
      @keydown="handleKeyPress"
      type="text"
      placeholder="Add a comment..."
      class="flex-grow px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
    />
    <button
      @click="handleAddComment"
      :disabled="!commentInput.trim()"
      class="bg-amber-500 text-white px-5 py-2 rounded-full text-sm hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Post
    </button>
  </div>
</template>
