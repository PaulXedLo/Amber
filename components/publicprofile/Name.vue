<script setup lang="ts">
import type { Profile } from "~/types/post";
defineProps<{
  profile: Profile;
}>();
</script>
<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-2xl font-bold">{{ profile.fullName }}</h1>
    <h1 class="text-1xl">@{{ profile.username }}</h1>
  </div>
</template>
