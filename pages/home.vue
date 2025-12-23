<script setup lang="ts">
definePageMeta({ layout: "default" });
import SearchInput from "~/components/home/SearchInput.vue";
// TYPESCRIPT TYPES
import type { FollowButtonText, FollowStatus } from "~/types/follow";
// STORES
const user = useUserStore();
const posts = usePostsStore();
// COMPOSABLES & REFS
const { fetchHomePosts, pending } = usePosts();
const { handleLikePost } = useLikes();
const { getFollowButtonText, publicUserFollow } = useFollow();
// HOOKS
// This hook is used to fetch posts and check if the current user is following the authors of those posts.
// It also fetches a random comment to display on the home page for each post.
onMounted(async () => {
  await fetchHomePosts();
});
</script>
<template>
  <div class="min-h-screen max-w-screen px-4 pb-10">
    <!--Search input-->
    <div class="hidden md:block">
      <SearchInput
        customClass="max-w-[320px] mx-auto shadow-lg border-amber-500/20"
      />
    </div>
    <!-- HOME PAGE TITLE -->
    <HomeHeaderTitle />
    <!-- CREATE NEW POST COMPONENT-->
    <PostsCreatePost />

    <!--LOADING SPINNER FOR POSTS-->
    <LoadingSpinner v-if="pending" />

    <!--POSTS-->
    <template v-else>
      <div class="flex flex-col items-center mt-8 gap-10">
        <HomePostItem
          v-for="post in posts.allPosts"
          :key="post.posts.id"
          :postItemData="post"
          :currentUserId="user.userId"
          :followStatusOfPostAuthor="
            user.followStatus[post.profiles.id] as FollowStatus['status']
          "
          :followButtonTextContent="
            getFollowButtonText(post.profiles.id) as FollowButtonText
          "
          @toggle-like-post="async () => await handleLikePost(post)"
          @trigger-follow-user="
            async ({ targetUserId, isPrivate, profile }) =>
              await publicUserFollow(targetUserId, isPrivate, profile)
          "
        />
      </div>
    </template>
  </div>
</template>
