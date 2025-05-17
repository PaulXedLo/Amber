<script setup lang="ts">
const {
  loading,
  comments,
  activeCommentId,
  handleDeleteComment,
  handleReport,
  fallbackImage,
  toggleCommentOptions,
} = useModal();
</script>
<template>
  <div
    class="flex-grow overflow-y-auto mt-2 bg-slate-800/50 p-2 rounded-lg custom-scrollbar"
  >
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!comments.length" class="text-center text-slate-500 mt-3">
      <p class="font-bold">No comments yet.</p>
      <p>Add a new comment if you want to be the first!</p>
    </div>
    <div v-else>
      <div
        v-for="comment in comments"
        :key="comment.commentId"
        class="flex gap-3 p-2 relative hover:bg-slate-700/50 rounded-md"
      >
        <NuxtImg
          :src="comment.profilePicture || fallbackImage"
          class="w-8 h-8 rounded-full mt-1"
        />
        <div class="flex flex-col w-full">
          <div class="flex justify-between items-center w-full">
            <p class="text-xs text-slate-400">
              <span class="font-semibold text-white">{{
                comment.username
              }}</span>
              <span class="ml-2 text-slate-500">
                <NuxtTime :datetime="comment.commentCreatedAt" relative />
              </span>
            </p>
            <div class="relative top-5 mt-1.25 w-8">
              <Icon
                name="weui:more-filled"
                size="20"
                class="cursor-pointer"
                @click="toggleCommentOptions(comment.commentId)"
              />
              <Options
                :comment="comment"
                :showCommentOptions="activeCommentId === comment.commentId"
                @deleteComment="() => handleDeleteComment(comment.commentId)"
                @reportComment="handleReport"
              />
            </div>
          </div>
          <p class="text-sm text-slate-200">
            {{ comment.commentText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
