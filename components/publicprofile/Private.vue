<script setup lang="ts">
import type { Post, Profile } from "~/types/post";
const user = useUserStore();
defineProps<{
  profile: Profile;
  posts: Post[];
  loadingProfile: boolean;
}>();
</script>
<template>
  <div
    v-if="!loadingProfile && profile"
    class="text-center mt-10 text-slate-400"
  >
    <p>This account is private. Follow to see their posts.</p>
  </div>
</template>
