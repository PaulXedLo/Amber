<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
    required: false,
  },
  notificationData: {
    type: Object,
    required: false,
  },
});

async function markAsRead() {}
</script>

<template>
  <div class="flex flex-col justify-between gap-2 pt-1">
    <div v-if="type === 'like'" class="flex items-center justify-between mt-1">
      <div class="flex items-center gap-2">
        <Icon name="noto:orange-heart" size="18" />
        <p class="text-sm text-slate-300">Liked your post</p>
      </div>
      <span v-if="postImage" class="w-10 h-10 flex-shrink-0">
        <NuxtImg
          class="w-full h-full object-cover rounded-md border border-slate-600"
          :src="postImage"
          densities="x1"
          alt="Post thumbnail"
        />
      </span>
    </div>

    <div v-else-if="type === 'comment'" class="flex items-center gap-2 mt-1">
      <Icon name="mdi:comment-text-outline" size="18" class="text-blue-400" />
      <p class="text-sm text-slate-300">
        Commented: "{{
          notificationData?.comments?.content.substring(0, 30)
        }}..."
      </p>
    </div>

    <div v-else-if="type === 'follow'" class="flex items-center gap-2 mt-1">
      <Icon name="mdi:account-plus-outline" size="18" class="text-green-400" />
      <p class="text-sm text-slate-300">Started following you.</p>
    </div>

    <div class="flex gap-4 w-full justify-end mt-2">
      <button
        class="text-xs text-slate-400 hover:text-amber-500 transition-colors duration-150 focus:outline-none"
      >
        Tap to view
      </button>
      <button
        @click="markAsRead"
        v-if="!notificationData?.notifications?.isRead"
        class="text-xs text-slate-400 hover:text-amber-500 transition-colors duration-150 focus:outline-none"
      >
        Mark as read
      </button>
    </div>
  </div>
</template>
