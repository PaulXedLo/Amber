<script setup>
definePageMeta({ layout: "default" });
import PostItem from "~/components/home/PostItem.vue";
const user = useUserStore();
const posts = usePostsStore();
// REFS
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
// LIKE POSTS
async function toggleLike(post) {
  // TOGGLE LIKE POST
  await toggleLikePost(post.posts.id, post.posts.likedByMe);
  post.posts.likedByMe = !post.posts.likedByMe;
  post.posts.likesCount += post.posts.likedByMe ? 1 : -1;
  // SEND(or)CANCEL NOTIFICATION
  if (post.posts.likedByMe) {
    await toggleNotification({
      targetUserId: post.profiles.id,
      postId: post.posts.id,
      type: post.posts.likedByMe ? "like" : "unlike",
    });
  }
}

// FOLLOW / UNFOLLOW USER
async function handleFollowClick(targetUserId, isPrivate, profile) {
  if (!targetUserId) return;
  // TOGGLE FOLLOW USER
  await toggleFollowUser(targetUserId, isPrivate);
  // SEND (OR) REMOVE NOTIFICATION
  if (user.followStatus[targetUserId] !== "unfollowed") {
    await toggleNotification({
      targetUserId,
      type:
        user.followStatus[targetUserId] === "followed" ? "follow" : "request",
    });
  }
  // GET FOLLOW FEEDBACK (TOAST)
  getFollowFeedback(targetUserId, profile);
}

// HOOKS
onMounted(async () => {
  pending.value = true;
  await posts.fetchPosts();
  // CHECK IF USER IS FOLLOWING PROFILES
  const followChecks = posts.allPosts
    .filter((post) => post.profiles?.id)
    .map((post) => checkIfFollowing(post.profiles?.id));
  // FETCH RANDOM COMMENT FOR EACH POST
  await getRandomComment();
  try {
    await Promise.all([...followChecks, ...commentFetches]);
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
        <PostItem
          v-for="post in posts.allPosts"
          :key="post.posts.id"
          :postItemData="post"
          :currentUserId="user.userId"
          :followStatusOfPostAuthor="user.followStatus[post.profiles.id]"
          :followButtonTextContent="getFollowButtonText(post.profiles.id)"
          @toggle-like-post="toggleLike"
          @trigger-follow-user="
            ({ targetUserId, isPrivate, profile }) =>
              handleFollowClick(targetUserId, isPrivate, profile)
          "
        />
      </div>
    </template>
  </div>
</template>
