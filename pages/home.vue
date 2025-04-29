<script setup>
definePageMeta({ layout: "default" });
// REFS
const user = useUserStore();
const posts = usePostsStore();
const showPostModal = ref(false);
const activePost = ref(null);
const pending = ref(false);
// MODAL FUNCTIONS
function openPost(post) {
  activePost.value = post;
  showPostModal.value = true;
}
function closeModal() {
  showPostModal.value = false;
}
// LIKE POSTS
async function toggleLike(post) {
  if (!post.likedByMe) {
    post.posts.likesCount++;
    post.likedByMe = true;
    await $fetch("/api/posts/togglelike", {
      method: "POST",
      body: { userId: user.userId, postId: post.posts.id },
    });
  } else {
    post.posts.likesCount = Math.max(post.posts.likesCount - 1, 0);
    post.likedByMe = false;
    await $fetch("/api/posts/togglelike", {
      method: "DELETE",
      body: { userId: user.userId, postId: post.posts.id },
    });
  }
}
// FOLLOW / UNFOLLOW USER
async function handleFollowClick(targetUserId) {
  if (!targetUserId) return;
  await user.toggleFollowUser(targetUserId);
  user.followStatus[targetUserId] = !user.followStatus[targetUserId];
}

// HOOKS
onMounted(async () => {
  pending.value = true;
  await posts.fetchPosts();
  const checks = posts.allPosts.map((post) => {
    if (post.profiles?.id) {
      return user.checkIfFollowing(post.profiles.id);
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
        class="text-4xl sm:text-5xl font-extrabold text-amber-400 drop-shadow-lg tracking-wide"
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
      <div class="flex flex-col items-center gap-10 mt-8">
        <div
          v-for="post in posts.allPosts"
          :key="post.posts.id"
          class="w-full max-w-2xl rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-lg hover:shadow-amber-500/20 transition duration-300 p-6"
        >
          <!--POST CONTENT-->
          <div
            class="flex justify-between items-center mb-4"
            @click="openPost(post)"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400"
              >
                <NuxtImg
                  :src="post.profiles.profilePicture || '/default-avatar.png'"
                  alt="avatar"
                  @click="navigateTo(`/profile/${post.profiles.username}`)"
                  class="w-full h-full object-cover cursor-pointer"
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
              @click="handleFollowClick(post.profiles.id)"
              class="px-4 py-1.5 rounded-md transition text-sm text-white font-semibold shadow-sm hover:shadow-md"
              :class="
                user.followStatus[post.profiles.id]
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-amber-500 hover:bg-amber-600'
              "
            >
              {{ user.followStatus[post.profiles.id] ? "Unfollow" : "Follow" }}
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
    <!--POST MODAL-->
    <PostModal v-if="showPostModal" :post="activePost" @close="closeModal" />
  </div>
</template>
