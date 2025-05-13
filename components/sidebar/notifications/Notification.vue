<script setup lang="ts">
import { motion } from "motion-v";
const { fetchNotifications, deleteNotification, notifications, loading } =
  useNotifications();

const buttonVariants = {
  initial: {
    scale: 1,
  },
  whileHover: {
    scale: 1.2,
  },
};

onBeforeMount(async () => {
  await fetchNotifications();
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
        v-if="!loading"
        v-for="notification in notifications"
        :key="notification.id"
        class="bg-slate-800/50 p-3 rounded-lg shadow-sm border border-slate-700/50 hover:bg-slate-800 transition-colors duration-150 overflow-hidden"
      >
        <div class="flex items-start justify-between mb-2">
          <!--NOTIFICATION SENT BY PROFILE INFORMATION-->
          <div class="flex items-center gap-2 flex-shrink-0 mr-2">
            <ProfilePicture
              :src="notification.senderProfilePicture"
              :sizeClasses="'w-8 h-8 rounded-full'"
              :navigateToPath="`/profile/${notification.senderUsername}`"
              :altText="'notification user profile picture'"
            />
            <h3
              class="text-sm font-semibold text-slate-100 truncate"
              style="max-width: 120px"
            >
              {{ notification.senderFullName }}
            </h3>
          </div>
          <div class="flex flex-col items-end text-right flex-shrink-0 ml-2">
            <!-- NOTIFICATION IS READ BOOL-->
            <span
              v-if="!notification.isRead"
              class="flex items-center gap-1 text-amber-400 mb-0.5"
            >
              <span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              <h3 class="text-xs font-medium">Unread</h3>
            </span>
            <!-- NOTIFICATION SENT AT TIME-->
            <span class="text-xs text-slate-400">
              <NuxtTime :datetime="notification.createdAt" relative />
            </span>
          </div>
        </div>
        <!-- NOTIFICATION TEXT -->

        <SidebarNotificationsText
          :post="notification.postContentImage"
          :type="notification.type"
          :comment="notification.commentContent"
          :notificationData="notification"
          class="break-words"
        />
        <!--DELETE AND VIEW   BUTTON-->
        <div class="flex gap-4 w-full justify-end mt-2">
          <motion.button
            v-if="notification.type === 'comment'"
            @click="navigateTo(`/posts/${notification.postId}`)"
            :variants="buttonVariants"
            initial="initial"
            whileHover="whileHover"
            class="cursor-pointer text-xs text-slate-400 hover:text-amber-500 transition-colors duration-150 focus:outline-none"
          >
            View
          </motion.button>
          <motion.button
            :variants="buttonVariants"
            initial="initial"
            whileHover="whileHover"
            @click="async () => await deleteNotification(notification.id)"
            class="cursor-pointer text-xs text-slate-400 hover:text-amber-500 transition-colors duration-150 focus:outline-none"
          >
            Delete
          </motion.button>
        </div>
      </div>
    </div>
  </div>
</template>
