<script setup lang="ts">
import { motion } from "motion-v";
import type { Comment } from "@/types/post";

const user = useUserStore();
const { userId } = toRefs(user);

const props = defineProps<{
  comment?: Comment;
  profileId?: string;
  showCommentOptions?: boolean;
  showPostOptions?: boolean;
}>();

const emit = defineEmits<{
  (e: "deleteComment"): void;
  (e: "reportComment"): void;
  (e: "deletePost"): void;
  (e: "reportPost"): void;
  (e: "close"): void;
}>();
</script>

<template>
  <!-- COMMENT OPTIONS -->
  <motion.div
    v-if="showCommentOptions"
    class="absolute z-50 right-0 top-6 flex overflow-hidden items-center bg-gray-800 border border-gray-700 rounded-xl shadow-md text-sm"
    :initial="{ opacity: 0, scale: 0.9, y: -10 }"
    :animate="{ opacity: 1, scale: 1, y: 0 }"
    :exit="{ opacity: 0, scale: 0.9, y: -10 }"
    :transition="{ duration: 0.15 }"
  >
    <button
      v-if="comment?.userId === userId"
      @click="$emit('deleteComment')"
      class="px-4 py-2 hover:bg-red-500 transition-colors"
    >
      Delete
    </button>
    <button
      @click="$emit('reportComment')"
      class="px-4 py-2 hover:bg-red-500 transition-colors"
    >
      Report
    </button>
  </motion.div>

  <!-- POST OPTIONS -->
  <motion.div
    v-if="showPostOptions"
    class="absolute z-50 right-0 top-8 flex flex-col overflow-hidden bg-gray-800 border border-gray-700 rounded-xl shadow-md text-sm"
    :initial="{ opacity: 0, scale: 0.9, y: -10 }"
    :animate="{ opacity: 1, scale: 1, y: 0 }"
    :exit="{ opacity: 0, scale: 0.9, y: -10 }"
    :transition="{ duration: 0.15 }"
  >
    <button
      v-if="profileId === userId"
      @click="$emit('deletePost')"
      class="px-4 w-30 cursor-pointer py-2 hover:bg-red-500 transition-colors"
    >
      Delete Post
    </button>
    <button
      v-if="profileId !== userId"
      @click="$emit('reportPost')"
      class="px-4 w-30 py-2 cursor-pointer hover:bg-red-500 transition-colors"
    >
      Report Post
    </button>
  </motion.div>
</template>
