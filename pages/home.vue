<script setup>
definePageMeta({ layout: "default" });
// REFS
const user = useUserStore();
const { fetchComments, comments } = useComments();
const { toggleLikePost } = useLikes();
const { toggleFollowUser, checkIfFollowing } = useFollow();
const posts = usePostsStore();
const pending = ref(false);

const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
// LIKE POSTS
async function toggleLike(post) {
  if (!post) return;
  try {
    await toggleLikePost(post.posts.id, post.posts.likedByMe);
    post.posts.likedByMe = !post.posts.likedByMe;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to toggle like. Please try again.");
  }
  post.posts.likesCount += post.posts.likedByMe ? 1 : -1;
}
// FOLLOW STATUS
function getFollowStatus(userId) {
  return user.followStatus[userId] || "";
}
const followStatus = (id) => {
  let status = getFollowStatus(id);
  if (status === "followed") {
    return "Unfollow";
  } else if (status === "pending") {
    return "Pending";
  } else if (status === "unfollowed") {
    return "Follow";
  }
};

// FOLLOW / UNFOLLOW USER
async function handleFollowClick(targetUserId, isPrivate) {
  if (!targetUserId) return;
  await toggleFollowUser(targetUserId, isPrivate);
}

// HOOKS
onMounted(async () => {
  pending.value = true;
  await posts.fetchPosts();
  // CHECK IF USER IS FOLLOWING PROFILES
  const followChecks = posts.allPosts
    .filter((post) => post.profiles?.id)
    .map((post) => getFollowStatus(post.profiles.id));
  // FETCH RANDOM COMMENT FOR EACH POST
  const commentFetches = posts.allPosts.map(async (post) => {
    try {
      const postComments = await fetchComments(post.posts.id);
      if (postComments && postComments.length > 0) {
        const randomIndex = Math.floor(Math.random() * postComments.length);
        post.displayComment = `"${postComments[randomIndex].commentText}"`;
      } else {
        post.displayComment = "Be the first one to comment";
      }
    } catch (error) {
      console.error(
        `Failed to fetch comments for post ${post.posts.id}:`,
        error
      );
      post.displayComment = "Could not load comments.";
    }
  });

  try {
    await Promise.all([...followChecks, ...commentFetches]);
  } catch (error) {
    console.error("Error during onMounted data fetching:", error);
  }

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
                class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-amber-400"
              >
                <NuxtImg
                  :src="post.profiles.profilePicture || fallbackImage"
                  alt="avatar"
                  @click="navigateTo(`/profile/${post.profiles.username}`)"
                  class="w-full hover:opacity-40 transition-all duration-400 h-full object-cover cursor-pointer"
                />
              </div>
              <div>
                <h2
                  class="text-white text-sm font-bold md:text-md leading-tight"
                >
                  {{ post.profiles.fullName || "Unknown User" }} -
                  <span class="text-xs md:text-sm text-slate-400">{{
                    post.posts.feeling
                  }}</span>
                </h2>
                <p
                  class="text-xs md:text-sm text-slate-400 cursor-pointer"
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
              {{ followStatus(post.profiles.id) }}
            </button>
          </div>

          <!-- Content -->
          <p class="text-slate-w-auto 300 text-sm md:text-lg mb-3">
            {{ post.posts.contentText || "No bio available" }}
          </p>

          <!-- Images -->

          <img
            v-if="post.posts.contentImage"
            @click="navigateTo(`/posts/${post.posts.id}`)"
            :src="post.posts.contentImage"
            alt="Post Image"
            class="rounded-lg w-full h-80 object-contain"
          />

          <!-- Likes and Comments -->
          <div class="flex items-center gap-6 mt-4">
            <!-- Like Button -->
            <button
              @click="toggleLike(post)"
              class="cursor-pointer flex items-center gap-3 text-slate-300 hover:text-amber-400 transition"
            >
              <span>
                <template v-if="post.posts.likedByMe"
                  ><Icon name="noto:orange-heart" size="30"
                /></template>
                <template v-else
                  ><Icon name="noto:white-heart" size="30"
                /></template>
              </span>
              <span class="font-bold text-l">{{
                post.posts.likesCount || 0
              }}</span>
            </button>

            <!-- Comment Button -->
            <button
              @click="navigateTo(`/posts/${post.posts.id}`)"
              class="cursor-pointer flex items-center gap-3 text-slate-300 hover:text-blue-400 transition"
            >
              <span>
                <Icon name="uil:comment" size="30" />
              </span>
              <span class="font-bold text-l">{{
                post.posts.commentsCount || 0
              }}</span>
            </button>
          </div>

          <p
            v-if="post.displayComment"
            class="flex items-center gap-3 text-slate-400 text-sm mt-3 italic"
          >
            <NuxtImg
              :src="post.profiles.profilePicture || fallbackImage"
              alt="avatar"
              class="w-8 h-8 rounded-full mr-2"
            />
            {{ post.displayComment }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
