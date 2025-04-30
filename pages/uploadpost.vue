<script setup>
definePageMeta({
  layout: "myprofile",
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start pt-16 px-4">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold tracking-tight">Create a New Post</h1>
      <p class="text-gray-500 mt-2">Share your ideas with us.</p>
    </div>

    <CreatePost />
    <div class="mt-12 text-center text-gray-400 text-sm">
      Your posts are really important to me 😊
    </div>
  </div>
</template>
