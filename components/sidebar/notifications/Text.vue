<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  post: {
    type: Object,
    required: false,
  },
  comment: {
    type: Object,
    required: false,
  },
  notificationData: {
    type: Object,
    required: false,
  },
});
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
          @click="navigateTo(`/posts/${post?.id}`)"
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
  </div>
</template>
