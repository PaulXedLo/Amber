<script setup lang="ts">
const { activePost } = useModal();
</script>
<template>
  <p v-if="activePost?.posts.contentText" class="text-sm text-slate-300">
    {{ activePost?.posts.contentText }}
  </p>
</template>
