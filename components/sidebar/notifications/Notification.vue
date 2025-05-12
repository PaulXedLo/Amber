<script setup>
const { fetchNotifications, notifications, loading } = useNotifications();
onBeforeMount(async () => {
  await fetchNotifications();
  console.log(notifications);
});
</script>
<template>
  <div>
    <LoadingSpinner v-if="loading" />

    <div v-if="!loading && notifications.length < 1" class="text-center py-10">
      <p class="text-sm text-gray-500">You currently have no notifications.</p>
    </div>

    <div v-else class="flex flex-col space-y-3">
      <div
        v-for="notification in notifications"
        :key="notification.notifications.id"
        class="bg-slate-800/50 p-3 rounded-lg shadow-sm border border-slate-700/50 hover:bg-slate-800 transition-colors duration-150 overflow-hidden"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2 flex-shrink-0 mr-2">
            <ProfilePicture
              :src="notification.profiles.profilePicture"
              :sizeClasses="'w-8 h-8 rounded-full'"
              :navigateToPath="`/profile/${notification.profiles.username}`"
              :altText="'notification user profile picture'"
            />
            <h3
              class="text-sm font-semibold text-slate-100 truncate"
              style="max-width: 120px"
            >
              {{ notification.profiles.fullName }}
            </h3>
          </div>

          <div class="flex flex-col items-end text-right flex-shrink-0 ml-2">
            <span
              v-if="!notification.notifications.isRead"
              class="flex items-center gap-1 text-amber-400 mb-0.5"
            >
              <span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              <h3 class="text-xs font-medium">Unread</h3>
            </span>
            <span class="text-xs text-slate-400">
              <NuxtTime
                :datetime="notification.notifications.createdAt"
                relative
              />
            </span>
          </div>
        </div>

        <SidebarNotificationsText
          :postImage="notification.posts?.contentImage"
          :type="notification.notifications.type"
          :notificationData="notification"
          class="break-words"
        />
      </div>
    </div>
  </div>
</template>
