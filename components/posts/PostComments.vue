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
    <div
      class="flex-grow w-full overflow-y-auto max-h-[calc(110vh-450px)] rounded-xl bg-slate-800/30 border border-slate-700/50 custom-scrollbar"
    >
      <LoadingSpinner v-if="loading" />

      <div
        v-else-if="!comments || comments.length === 0"
        class="text-center py-10 px-4 text-slate-500 flex flex-col items-center gap-2"
      >
        <Icon
          name="ph:chat-teardrop-text-light"
          size="40"
          class="opacity-50 mb-1"
        />
        <p class="font-bold text-slate-300">No comments yet.</p>
        <span class="text-sm"
          >Add a new comment if you want to be the first!</span
        >
      </div>

      <div v-else class="divide-y divide-slate-700/50">
        <div
          v-for="comment in comments"
          :key="comment.commentId"
          class="flex items-start p-4 gap-4 hover:bg-slate-700/20 transition-colors duration-200"
        >
          <NuxtLink :to="`/profile/${comment.username}`" class="flex-shrink-0">
            <NuxtImg
              :src="comment.profilePicture || fallbackImage"
              class="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700/50"
            />
          </NuxtLink>

          <div class="flex flex-col flex-grow min-w-0">
            <div class="flex justify-between items-start gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <NuxtLink
                  :to="`/profile/${comment.username}`"
                  class="font-bold text-sm text-slate-100 hover:underline"
                >
                  {{ comment.username }}
                </NuxtLink>
                <span class="sm:text-xs text-[10px] text-slate-500">
                  <NuxtTime :datetime="comment.commentCreatedAt" relative />
                </span>
              </div>

              <div class="relative flex-shrink-0">
                <button
                  class="text-slate-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
                  @click="emit('toggleCommentOptions', comment.commentId)"
                >
                  <Icon name="weui:more-filled" size="18" />
                </button>

                <Options
                  :comment="comment"
                  :showCommentOptions="activeCommentId === comment.commentId"
                  @deleteComment="
                    () => emit('deleteComment', comment.commentId)
                  "
                  @reportComment="
                    () => emit('reportComment', comment.commentId)
                  "
                />
              </div>
            </div>

            <p
              class="text-[14px] leading-relaxed text-slate-300 break-words mt-1 pr-2"
            >
              {{ comment.commentText }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-start gap-3 w-full bg-slate-800/40 p-3 rounded-xl border border-slate-700/50"
    >
      <NuxtImg
        :src="userProfilePic || fallbackImage"
        class="rounded-full w-9 h-9 object-cover ring-1 ring-slate-600 flex-shrink-0"
      />
      <div class="flex flex-col flex-grow gap-2 relative">
        <textarea
          rows="1"
          :value="commentText"
          @input="
            (e) =>
              emit('update:commentText', (e.target as HTMLInputElement).value)
          "
          class="w-full bg-transparent text-slate-200 placeholder-slate-500 text-sm focus:outline-none py-2 resize-none custom-scrollbar min-h-[40px]"
          placeholder="Write a comment..."
          style="field-sizing: content"
        ></textarea>

        <div class="flex justify-end">
          <button
            type="button"
            @click="emit('addComment')"
            class="cursor-pointer px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!commentText.trim()"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
