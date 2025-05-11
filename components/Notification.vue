<script setup>
const {
  fetchNotifications,
  notifications,
  loading,
  showNotifications,
  toggleNotification,
} = useNotifications();
onMounted(async () => {
  await fetchNotifications();
  console.log(notifications);
});
</script>
<template>
  <LoadingSpinner v-if="loading" />
  <div v-if="notifications.length < 1">
    <p v-show="!loading" class="mt-5 text-center text-sm text-gray-500">
      You currently have no notifications
    </p>
  </div>
  <div v-else class="min-w-full">
    <div v-for="notification in notifications" :key="notification"></div>
  </div>
</template>
