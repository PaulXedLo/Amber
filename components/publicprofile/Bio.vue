<script setup lang="ts">
import type { Profile } from "~/types/post";
defineProps<{
  profile: Profile;
}>();
</script>
<template>
  <h3 v-if="profile.bio" class="text-1xl text-white mt-2 text-center max-w-md">
    {{ profile.bio }}
  </h3>
</template>
