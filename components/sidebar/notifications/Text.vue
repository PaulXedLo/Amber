<script setup lang="ts">
import type { Notification } from "~/types/notification";
const props = defineProps<{
  type: Notification["type"];
  post?: Notification["postContentImage"];
  comment?: Notification["commentContent"];
  notificationData?: Notification;
}>();

const emit = defineEmits(["requestHandled"]);

const { acceptRequest } = useNotifications();
async function handleAcceptRequest() {
  await acceptRequest(
    props.notificationData?.senderId as string,
    props.notificationData?.id as string
  );
  emit("requestHandled");
}
</script>

<template>
  <div class="flex flex-col justify-between gap-2 pt-1">
    <div v-if="type === 'like'" class="flex items-center justify-between mt-1">
      <div class="flex items-center gap-3 ml-2">
        <Icon name="noto:orange-heart" size="18" />
        <p class="text-sm text-slate-300">Liked your post</p>
      </div>
      <span v-if="post" class="w-10 h-10 flex-shrink-0">
        <NuxtImg
          @click="navigateTo(`/posts/${notificationData?.postId}`)"
          class="cursor-pointer w-full h-full object-cover rounded-md border border-slate-600"
          :src="post"
          densities="x1"
          alt="Post thumbnail"
        />
      </span>
    </div>
    <div v-else-if="type === 'comment'" class="flex items-center gap-2 mt-1">
      <Icon name="mdi:comment-text-outline" size="18" class="text-blue-400" />
      <p class="text-sm text-slate-300">
        Commented on your post: "{{ comment?.substring(0, 30) }}..."
      </p>
    </div>
    <div
      v-else-if="type === 'follow'"
      class="flex ml-2 items-center gap-2 mt-1"
    >
      <Icon name="mdi:account-plus-outline" size="18" class="text-green-400" />
      <p class="text-sm text-slate-300">Started following you.</p>
    </div>
    <div
      v-else-if="type === 'request'"
      class="flex ml-2 items-center justify-between gap-3 mt-1"
    >
      <div className="flex gap-3">
        <Icon
          name="mdi:account-plus-outline"
          size="18"
          class="text-green-400"
        />
        <p class="text-[14px] text-slate-300">Follow Request</p>
      </div>
      <SidebarNotificationsRequestButton
        :name="'Accept'"
        :senderId="notificationData?.senderId as string"
        :notificationId="notificationData?.id as string"
        @handleRequest="handleAcceptRequest"
      />
      <SidebarNotificationsRequestButton
        :name="'Reject'"
        :senderId="notificationData?.senderId as string"
        :notificationId="notificationData?.id as string"
      />
    </div>
  </div>
</template>
