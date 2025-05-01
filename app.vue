<script setup>
const user = useUserStore(usePinia());
onMounted(async () => {
  await user.checkAuth();
});
</script>
<template>
  <template v-if="!user.hydrated">
    <div class="h-screen flex justify-center items-center">
      <span class="loading loading-spinner loading-xl"></span>
    </div>
  </template>
  <template v-else>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </template>
</template>
