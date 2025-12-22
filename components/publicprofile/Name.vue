<script setup lang="ts">
import type { Profile } from "~/types/post";
defineProps<{
  profile: Profile;
}>();
</script>
<template>
  <div class="flex flex-col justify-center items-center">
    <div class="flex gap-4 items-center">
      <h1 class="text-2xl text-white font-semibold">{{ profile.fullName }}</h1>
      <span v-if="profile.showAge" class="text-amber-500">{{
        profile.age
      }}</span>
    </div>
    <h1 class="text-white text-1xl">@{{ profile.username }}</h1>
  </div>
</template>
