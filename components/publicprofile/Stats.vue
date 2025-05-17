<script setup lang="ts">
import type { Profile } from "~/types/post";

defineProps<{
  profile: Profile;
}>();
</script>

<template>
  <div class="flex justify-center gap-10 mt-6">
    <div class="text-center">
      <h2 class="text-lg font-bold">Followers</h2>
      <p class="text-slate-400">{{ profile.followersCount || 0 }}</p>
    </div>
    <div class="text-center">
      <h2 class="text-lg font-bold">Following</h2>
      <p class="text-slate-400">{{ profile.followingCount || 0 }}</p>
    </div>
    <div class="text-center">
      <h2 class="text-lg font-bold">Posts</h2>
      <p class="text-slate-400">{{ profile.postsCount || 0 }}</p>
    </div>
  </div>
</template>
