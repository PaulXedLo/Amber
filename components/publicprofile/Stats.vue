<script setup lang="ts">
import type { Profile } from "~/types/post";
import { usePublicStore } from "~/stores/profile/public";
const publicStore = usePublicStore();
const { followersCount, followingCount, postsCount } = toRefs(publicStore);
defineProps<{
  profile: Profile;
}>();
</script>

<template>
  <div class="flex justify-center gap-10 mt-6">
    <div class="text-center">
      <h2 class="text-lg font-bold">Followers</h2>
      <p class="text-slate-400">{{ followersCount || 0 }}</p>
    </div>
    <div class="text-center">
      <h2 class="text-lg font-bold">Following</h2>
      <p class="text-slate-400">{{ followingCount || 0 }}</p>
    </div>
    <div class="text-center">
      <h2 class="text-lg font-bold">Posts</h2>
      <p class="text-slate-400">{{ postsCount || 0 }}</p>
    </div>
  </div>
</template>
