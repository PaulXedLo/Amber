<script setup>
definePageMeta({ layout: "default" });
// REFS
const user = useUserStore();
const { toggleLikePost } = useLikes();
const { toggleFollowUser, checkIfFollowing } = useFollow();
const posts = usePostsStore();
const pending = ref(false);
// LIKE POSTS
async function toggleLike(post) {
  if (!post) return;
  try {
    await toggleLikePost(post.posts.id, post.likedByMe);
    post.likedByMe = !post.likedByMe;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to toggle like. Please try again.");
  }
  post.posts.likesCount += post.likedByMe ? 1 : -1;
}
// FOLLOW STATUS
function getFollowStatus(userId) {
  return user.followStatus[userId] || "";
}
// FOLLOW / UNFOLLOW USER
async function handleFollowClick(targetUserId, isPrivate) {
  if (!targetUserId) return;
  await toggleFollowUser(targetUserId, isPrivate);
}

// HOOKS
onMounted(async () => {
  pending.value = true;
  await posts.fetchPosts();
  const checks = posts.allPosts.map((post) => {
    if (post.profiles?.id) {
      return checkIfFollowing(post.profiles.id);
    }
  });
  await Promise.all(checks);

  pending.value = false;
});
</script>
<template>
  <div class="min-h-screen w-full px-4 pb-10">
    <!-- PAGE TITLE -->
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
      <div class="flex flex-col items-center mt-8 gap-3">
        <div
          v-for="post in posts.allPosts"
          :key="post.posts.id"
          class="w-full max-w-2xl rounded-2xl bg-slate-900/80 border-r border-amber-500/10 backdrop-blur-md shadow-md hover:shadow-[0_0_12px_rgba(251,191,36,0.3)] transition duration-300 p-6"
        >
          <!--POST CONTENT-->
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400"
              >
                <NuxtImg
                  :src="post.profiles.profilePicture"
                  alt="avatar"
                  @click="navigateTo(`/profile/${post.profiles.username}`)"
                  class="w-full hover:opacity-40 transition-all duration-400 h-full object-cover cursor-pointer"
                />
              </div>
              <div>
                <h2 class="text-white font-bold text-md leading-tight">
                  {{ post.profiles.fullName || "Unknown User" }} -
                  <span class="text-sm text-slate-400">{{
                    post.posts.feeling
                  }}</span>
                </h2>
                <p
                  class="text-sm text-slate-400 cursor-pointer"
                  @click="navigateTo(`/profile/${post.profiles.username}`)"
                >
                  @{{ post.profiles.username || "@unknown" }}
                </p>
              </div>
            </div>
            <button
              v-if="post.profiles.username !== user.username"
              @click="
                handleFollowClick(post.profiles.id, post.profiles.isPrivate)
              "
              class="px-4 py-1.5 rounded-md transition text-sm text-white font-semibold shadow-sm hover:shadow-md"
              :class="{
                'bg-slate-700 hover:bg-slate-600':
                  getFollowStatus(post.profiles.id) === 'followed',
                'bg-slate-500 hover:bg-slate-400':
                  getFollowStatus(post.profiles.id) === 'pending',
                'bg-amber-500 hover:bg-amber-600':
                  getFollowStatus(post.profiles.id) === 'unfollowed',
              }"
            >
              {{
                getFollowStatus(post.profiles.id) === "followed"
                  ? "Unfollow"
                  : getFollowStatus(post.profiles.id) === "pending"
                  ? "Pending"
                  : "Follow"
              }}
            </button>
          </div>

          <!-- Content -->
          <p class="text-slate-300 mb-3">
            {{ post.posts.contentText || "No bio available" }}
          </p>

          <img
            v-if="post.posts.contentImage"
            @click="navigateTo(`/posts/${post.posts.id}`)"
            :src="post.posts.contentImage"
            alt="Post Image"
            class="rounded-lg w-full object-cover"
          />

          <!-- Likes -->
          <div class="flex items-center gap-2 mt-4">
            <button
              @click="toggleLike(post)"
              class="cursor-pointer flex items-center gap-3 text-slate-300 hover:text-amber-400 transition"
            >
              <span>
                <template v-if="post.likedByMe"
                  ><Icon name="noto:orange-heart" size="20"
                /></template>
                <template v-else
                  ><Icon name="noto:white-heart" size="20"
                /></template>
              </span>
              <span class="font-bold text-l">{{
                post.posts.likesCount || 0
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
