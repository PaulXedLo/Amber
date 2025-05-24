<script setup lang="ts">
import type { Comment } from "~/types/post";
// PROPS
defineProps<{
  comments: Comment[];
  loading: boolean;
  activeCommentId: string | null;
  commentText: string;
  userProfilePic: string;
}>();
// EMITS
const emit = defineEmits<{
  (e: "toggleCommentOptions", commentId: string): void;
  (e: "deleteComment", commentId: string): void;
  (e: "reportComment", commentId: string): void;
  (e: "update:commentText", value: string): void;
  (e: "addComment"): void;
}>();

const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
</script>

<template>
  <div class="flex flex-col gap-6 w-full mt-6">
    <!-- Comments List -->
    <div
      class="flex-grow w-full overflow-y-auto max-h-[calc(110vh-450px)] p-1 rounded-lg bg-slate-800/50 custom-scrollbar"
    >
      <LoadingSpinner v-if="loading" />
      <div
        v-else-if="!comments || comments.length === 0"
        class="text-center p-4 text-slate-500 flex flex-col items-center gap-4 mt-3 font-bold"
      >
        No comments yet.
        <span class="w-full"
          >Add a new comment if you want to be the first!</span
        >
      </div>

      <div v-else>
        <div
          v-for="comment in comments"
          :key="comment.commentId"
          class="flex items-start p-3 gap-3 hover:bg-slate-700/40 rounded-md"
        >
          <NuxtLink :to="`/profile/${comment.username}`">
            <NuxtImg
              :src="comment.profilePicture || fallbackImage"
              class="w-8 h-7 rounded-full mt-1 object-cover"
            />
          </NuxtLink>
          <div class="flex justify-between w-full items-start gap-2">
            <div class="flex flex-col">
              <p class="text-xs text-slate-400 mb-0.5">
                <NuxtLink
                  :to="`/profile/${comment.username}`"
                  class="font-semibold text-white"
                  >{{ comment.username }}</NuxtLink
                >
                <span class="ml-2 text-slate-500">
                  <NuxtTime :datetime="comment.commentCreatedAt" relative />
                </span>
              </p>
              <p class="text-sm text-slate-200 break-words">
                {{ comment.commentText }}
              </p>
            </div>
            <div class="relative mt-1.25 w-8 flex-shrink-0">
              <Icon
                name="weui:more-filled"
                class="cursor-pointer"
                size="20"
                @click="emit('toggleCommentOptions', comment.commentId)"
              />
              <Options
                :comment="comment"
                :showCommentOptions="activeCommentId === comment.commentId"
                @deleteComment="() => emit('deleteComment', comment.commentId)"
                @reportComment="() => emit('reportComment', comment.commentId)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comment Input -->
    <div class="flex items-start gap-4 w-full">
      <NuxtImg
        :src="userProfilePic"
        class="rounded-full w-10 h-10 object-cover border border-gray-700 shadow-md"
      />
      <div class="flex flex-grow gap-2">
        <input
          type="text"
          :value="commentText"
          @input="(e) => emit('update:commentText', (e.target as HTMLInputElement).value)"
          class="w-full h-11 border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
          placeholder="Add a comment..."
        />
        <button
          type="button"
          @click="emit('addComment')"
          class="h-11 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!commentText.trim()"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>
