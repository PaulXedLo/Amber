<script setup lang="ts">
definePageMeta({ layout: "default" });
// TYPESCRIPT TYPES
import type { PostWithProfile } from "~/types/post";
import type { FollowUserPayload } from "~/types/follow";
// STORES
const user = useUserStore();
const posts = usePostsStore();
// COMPOSABLES & REFS
const { getRandomComment } = useComments();
const { toggleNotification } = useNotifications();
const { toggleLikePost } = useLikes();
const {
  toggleFollowUser,
  checkIfFollowing,
  getFollowButtonText,
  getFollowFeedback,
} = useFollow();
const pending = ref(false);

// TOGGLE LIKE FUNCTION
// This function toggles the like status of a post and updates the likes count.
// It also sends a notification if the post is liked.
async function toggleLike(post: PostWithProfile) {
  await toggleLikePost(post.posts.id, post.posts.likedByMe ?? false);
  post.posts.likedByMe = !post.posts.likedByMe;
  post.posts.likesCount += post.posts.likedByMe ? 1 : -1;

  if (post.posts.likedByMe) {
    await toggleNotification({
      targetUserId: post.profiles.id,
      postId: post.posts.id,
      type: "like",
    });
  }
}
// TOGGLE FOLLOW FUNCTION
// This function toggles the follow status of a user and updates the follow status.
// It also sends a notification if the user is followed.
async function handleFollowClick(
  targetUserId: string,
  isPrivate: boolean,
  profile: any
) {
  if (!targetUserId) return;

  await toggleFollowUser(targetUserId, isPrivate);

  if (user.followStatus[targetUserId] !== "unfollowed") {
    await toggleNotification({
      targetUserId,
      type:
        user.followStatus[targetUserId] === "followed" ? "follow" : "request",
    });
  }

  getFollowFeedback(targetUserId, profile);
}
// HOOKS
// This hook is used to fetch posts and check if the current user is following the authors of those posts.
// It also fetches a random comment to display on the home page for each post.
onMounted(async () => {
  pending.value = true;
  await posts.fetchPosts();

  const followChecks = posts.allPosts
    .filter((post) => post.profiles?.id)
    .map((post) => checkIfFollowing(post.profiles.id));

  try {
    await Promise.all([getRandomComment(), ...followChecks]);
  } catch (error) {
    console.error("Error during onMounted data fetching:", error);
  }
  pending.value = false;
});
</script>
<template>
  <div class="min-h-screen max-w-screen px-4 pb-10">
    <!-- HOME PAGE TITLE -->
    <div class="text-center mt-12 animate__animated animate__bounce">
      <h1
        class="text-4xl sm:text-5xl font-extrabold text-[--color-primary] drop-shadow-lg tracking-wide"
      >
        Top posts for you
      </h1>
    </div>
    <!-- CREATE NEW POST COMPONENT-->
    <CreatePost />

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
          :followStatusOfPostAuthor="user.followStatus[post.profiles.id] as string | undefined"
          :followButtonTextContent="getFollowButtonText(post.profiles.id) as string | undefined"
          @toggle-like-post="toggleLike"
          @trigger-follow-user="
            ({ targetUserId, isPrivate, profile }: FollowUserPayload) =>
              handleFollowClick(targetUserId, isPrivate, profile)
          "
        />
      </div>
    </template>
  </div>
</template>
