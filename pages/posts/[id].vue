<script setup lang="ts">
import { motion } from "motion-v";
import "animate.css";
import type { Post } from "~/types/post";

definePageMeta({ layout: "default" });

// COMPOSABLES
const route = useRoute();
const user = useUserStore();
// usePosts composable
const {
  fetchSinglePost,
  handleDeletePost,
  handleAddComment,
  handleDeleteComment,
  likePost,
  handleReport,
  togglePostOptions,
  toggleCommentOptions,
  postInfo,
  userInfo,
  comments,
  loading,
  commentText,
  activePostId,
  activeCommentId,
} = usePosts();

onBeforeMount(async () => {
  try {
    await fetchSinglePost(route.params.id as string);
  } catch {
    navigateTo("/home");
  }
});
</script>

<template>
  <div
    v-if="postInfo && userInfo"
    class="flex flex-col min-h-screen w-full text-white py-12 px-4 sm:px-6 lg:px-8"
  >
    <motion.div
      :initial="{ opacity: 0, scale: 0.4 }"
      :whileInView="{
        opacity: 1,
        scale: 1,
        boxShadow: [
          '0px 0px 8px rgba(251,191,36,0.3)',
          '0px 0px 16px rgba(251,191,36,0.6)',
          '0px 0px 8px rgba(251,191,36,0.3)',
        ],
      }"
      :transition="{
        default: { duration: 0.5, ease: 'easeOut' },
        boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
      }"
      :viewport="{ margin: '-100px' }"
      class="flex flex-col items-center bg-slate-900/80 p-8 sm:p-10 rounded-2xl w-full max-w-3xl mx-auto gap-8 shadow-xl border border-gray-800"
    >
      <!-- Header -->
      <PostsPostHeader
        :userInfo="userInfo"
        :postInfo="postInfo"
        :activePostId="activePostId as string"
        @deletePost="async () => await handleDeletePost(postInfo?.id as string)"
        @reportPost="async () => await handleReport(postInfo?.id as string)"
        @toggleOptions="() => togglePostOptions(postInfo?.id as string)"
        @close="() => togglePostOptions(postInfo?.id as string)"
      />

      <!-- Description -->
      <PostsPostDescription :postInfo="postInfo" />

      <!-- Post Image -->
      <PostsPostImage :postInfo="postInfo" />

      <!-- Actions & Comment Input -->
      <PostsPostActions
        :postInfo="postInfo"
        :commentText="commentText"
        @like="async () => await likePost(postInfo as Post)"
        @addComment="async () => await handleAddComment(postInfo?.id as string)"
      />

      <!-- Comments Section -->
      <PostsPostComments
        :comments="comments"
        :loading="loading"
        :commentText="commentText"
        :userProfilePic="user.profilePic as string"
        :activeCommentId="activeCommentId"
        @update:commentText="(val) => (commentText = val)"
        @addComment="async () => await handleAddComment(postInfo?.id as string)"
        @toggleCommentOptions="toggleCommentOptions"
        @deleteComment="
          async (id) => await handleDeleteComment(id, postInfo?.id as string)
        "
        @reportComment="async () => await handleReport(postInfo?.id as string)"
      />
    </motion.div>
  </div>
</template>
