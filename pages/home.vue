<script setup>
definePageMeta({ layout: "default" });
import { motion } from "motion-v";
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
const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
// LIKE POSTS
async function toggleLike(post) {
  await toggleLikePost(post.posts.id, post.posts.likedByMe);
  post.posts.likedByMe = !post.posts.likedByMe;
  post.posts.likesCount += post.posts.likedByMe ? 1 : -1;
  await toggleNotification({
    userId: user.userId,
    targetUserId: post.profiles.id,
    postId: post.posts.id,
    type: post.posts.likedByMe ? "like" : "unlike",
  });
}

// FOLLOW / UNFOLLOW USER
async function handleFollowClick(targetUserId, isPrivate, profile) {
  if (!targetUserId) return;
  await toggleFollowUser(targetUserId, isPrivate);
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
          v-for="(post, index) in posts.allPosts"
          :key="post.posts.id"
          :custom="index"
          class="w-full max-w-2xl rounded-2xl bg-slate-900/80 border-r border-amber-500/10 backdrop-blur-md p-6"
        >
          <!--POST CONTENT-->
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-4">
              <ProfilePicture
                :src="post.profiles.profilePicture"
                :navigateToPath="`/profile/${post.profiles.username}`"
                :altText="'User profile picture'"
              />
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
              v-if="
                post.profiles?.id &&
                user.userId &&
                post.profiles.id !== user.userId
              "
              @click="
                handleFollowClick(
                  post.profiles.id,
                  post.profiles.isPrivate,
                  post.profiles
                )
              "
              class="cursor-pointer px-4 py-1.5 rounded-md transition text-sm text-white font-semibold shadow-sm hover:shadow-md"
              :class="{
                'bg-slate-700 hover:bg-slate-600':
                  user.followStatus[post.profiles.id] === 'followed',
                'bg-slate-500 hover:bg-slate-400':
                  user.followStatus[post.profiles.id] === 'pending',
                'bg-amber-500 hover:bg-amber-600':
                  user.followStatus[post.profiles.id] === 'unfollowed',
              }"
            >
              {{ getFollowButtonText(post.profiles.id) }}
            </button>
          </div>

          <!-- Content -->
          <p class="text-slate-w-auto 300 text-sm md:text-lg mb-3">
            {{ post.posts.contentText || "No bio available" }}
          </p>

          <!-- Images -->

          <motion.img
            :whileHover="{ scale: 1.05 }"
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
              <motion.span
                :whileHover="{ scale: 1.05 }"
                :whilePress="{ scale: 1.2 }"
              >
                <template v-if="post.posts.likedByMe"
                  ><Icon name="noto:orange-heart" size="30"
                /></template>
                <template v-else
                  ><Icon name="noto:white-heart" size="30"
                /></template>
              </motion.span>
              <span class="font-bold text-l">{{
                post.posts.likesCount || 0
              }}</span>
            </button>

            <!-- Comment Button -->
            <button
              @click="navigateTo(`/posts/${post.posts.id}`)"
              class="cursor-pointer flex items-center gap-3 text-slate-300 hover:text-blue-400 transition"
            >
              <motion.span
                :whileHover="{ scale: 1.05 }"
                :whilePress="{ scale: 1.2 }"
              >
                <Icon name="uil:comment" size="30" />
              </motion.span>
              <span class="font-bold text-l">{{
                post.posts.commentsCount || 0
              }}</span>
            </button>
          </div>

          <p
            v-if="post.displayComment"
            class="flex items-center gap-3 text-slate-400 text-sm mt-3 italic"
          >
            <ProfilePicture
              :src="post.profiles.profilePicture"
              :navigateToPath="`/profile/${post.profiles.username}`"
              :altText="'User profile picture'"
              :sizeClasses="'w-8 h-8 rounded-full'"
            />
            {{ post.displayComment }}
          </p>
        </motion.div>
      </div>
    </template>
  </div>
</template>
