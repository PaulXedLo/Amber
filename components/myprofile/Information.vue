<script setup lang="ts">
const user = useUserStore();
const { fullName, username, age } = toRefs(user);
</script>
<template>
  <div class="flex flex-col justify-center items-center">
    <div class="flex gap-4 items-center">
      <h1 class="text-2xl font-semibold">{{ fullName }}</h1>
      <span v-if="user.showAge" class="text-amber-500">{{ age }}</span>
    </div>
    <h1 class="text-1xl">@{{ username }}</h1>
  </div>
</template>
