<script setup lang="ts">
const {
  loading,
  comments,
  activeCommentId,
  handleDeleteComment,
  handleReport,
  fallbackImage,
  closeModal,
  toggleCommentOptions,
} = useModal();
</script>
<template>
  <div
    class="flex-grow overflow-y-auto mt-4 bg-slate-900/40 rounded-xl custom-scrollbar border border-slate-700/30"
  >
    <LoadingSpinner v-if="loading" />

    <div
      v-else-if="!comments.length"
      class="p-8 flex flex-col gap-5 text-center text-slate-500"
    >
      <Icon
        name="ph:chat-circle-dots-thin"
        size="48"
        class="mx-auto text-white mb-2 opacity-20"
      />
      <p class="font-bold text-slate-300">No comments yet.</p>
      <p class="text-sm">Be the first to share your thoughts!</p>
    </div>

    <div v-else class="divide-y divide-slate-800/50">
      <div
        v-for="comment in comments"
        :key="comment.commentId"
        class="flex gap-4 p-4 hover:bg-slate-800/30 transition-all duration-200"
      >
        <NuxtLink :to="`/profile/${comment.username}`" class="flex-shrink-0">
          <div
            class="w-10 h-10 rounded-full ring-2 ring-slate-700/50 overflow-hidden"
          >
            <NuxtImg
              @click="closeModal"
              :src="comment.profilePicture || fallbackImage"
              class="w-full h-full object-cover"
            />
          </div>
        </NuxtLink>

        <div class="flex flex-col flex-grow min-w-0 pt-0.5">
          <div class="flex justify-between items-start mb-1">
            <div class="flex items-center gap-2 flex-wrap">
              <NuxtLink
                @click="closeModal"
                :to="`/profile/${comment.username}`"
                class="font-bold text-[15px] text-slate-100 hover:underline decoration-slate-500"
              >
                {{ comment.username }}
              </NuxtLink>
              <span class="text-[13px] text-slate-500 font-medium">
                <NuxtTime :datetime="comment.commentCreatedAt" relative />
              </span>
            </div>

            <div class="relative flex-shrink-0">
              <button
                @click="toggleCommentOptions(comment.commentId)"
                class="cursor-pointer p-1 rounded-full text-slate-500 hover:text-white transition-colors"
              >
                <Icon name="weui:more-filled" size="18" />
              </button>

              <Options
                :comment="comment"
                :showCommentOptions="activeCommentId === comment.commentId"
                @deleteComment="() => handleDeleteComment(comment.commentId)"
                @reportComment="handleReport"
              />
            </div>
          </div>

          <p
            class="text-[14px] leading-relaxed text-slate-300 break-words pr-4"
          >
            {{ comment.commentText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
