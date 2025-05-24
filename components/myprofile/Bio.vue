<script setup lang="ts">
const user = useUserStore();
const { bio } = toRefs(user);
</script>
<template>
  <h3 class="text-1xl">{{ bio }}</h3>
</template>
