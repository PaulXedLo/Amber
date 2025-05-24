<script setup lang="ts">
const user = useUserStore();
const { followersCount, followingCount, postsCount } = toRefs(user);
</script>
<template>
  <div class="flex justify-center gap-10 mt-6">
    <div class="text-center">
      <h2 class="text-lg font-bold">Followers</h2>
      <p class="text-slate-400">{{ followersCount }}</p>
    </div>
    <div class="text-center">
      <h2 class="text-lg font-bold">Following</h2>
      <p class="text-slate-400">{{ followingCount }}</p>
    </div>
    <div class="text-center">
      <h2 class="text-lg font-bold">Posts</h2>
      <p class="text-slate-400">{{ postsCount }}</p>
    </div>
  </div>
</template>
