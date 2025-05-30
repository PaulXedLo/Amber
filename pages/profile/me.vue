<script setup>
import "animate.css";
definePageMeta({
  layout: "myprofile",
});
import { motion } from "motion-v";
const { openModal, activePost, closeModal, isOpen } = useModal();
// USER PROFILE REFS
const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
const loadingPosts = ref(false);
const posts = usePostsStore();
const loadingProfile = ref(true);
const user = useUserStore();
const {
  profilePic: profilePicture,
  username,
  fullName,
  bio,
  postsCount,
} = storeToRefs(user);

// UPDATE POSTS COUNT

function updatePostsCount() {
  postsCount.value = posts.userPosts.length;
}

// HOOKS

onBeforeMount(async () => {
  loadingProfile.value = true;
  await user.fetchUserProfile();
  loadingProfile.value = false;
});
onMounted(async () => {
  loadingPosts.value = true;
  await posts.fetchPosts();
  loadingPosts.value = false;
});
</script>

<template>
  <ModalPostModal @close="closeModal" @postRemoved="updatePostsCount" />
  <MyprofileShareModal />
  <div
    v-if="!loadingProfile"
    class="max-w-4xl mx-auto px-4 mt-10 animate__animated animate__fadeInUp animate__faster"
  >
    <!-- Profile header -->
    <div class="flex flex-col items-center gap-4">
      <div class="avatar">
        <MyprofilePicture
          :src="profilePicture"
          :isClickable="false"
          :altText="'User profile picture'"
          :sizeClasses="'w-32 h-32'"
        />
      </div>
      <!--Name, age, username-->
      <MyprofileInformation />
      <!-- Bio -->
      <MyprofileBio />
      <!-- Profile options -->
      <MyprofileButtons />
      <!-- Stats -->
      <MyprofileStats />
    </div>

    <!-- Posts Grid -->
    <div v-if="postsCount < 1" class="flex flex-col gap-4 items-center mt-10">
      <h1 class="text-2xl font-bold">No posts yet</h1>
      <p class="text-slate-400">Start sharing your moments!</p>
      <motion.button
        :whileHover="{ scale: 1.05 }"
        :whilePress="{ scale: 0.95 }"
        @click="$router.push('/uploadpost')"
        class="cursor-pointer px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
      >
        Add new post
      </motion.button>
    </div>
    <div class="grid grid-cols-3 gap-2 sm:gap-4 mt-10" v-if="!loadingPosts">
      <div
        v-for="post in posts.userPosts"
        :key="post.contentImage"
        class="w-full aspect-square overflow-hidden rounded-lg bg-slate-800 shadow-md hover:shadow-amber-500/20 transition"
      >
        <NuxtImg
          :src="post.posts.contentImage"
          @click="openModal(post.posts.id)"
          alt="Post image"
          class="w-full h-full object-cover transform hover:scale-105 transition duration-300 hover:opacity-80"
          densities="x1"
        />
      </div>
    </div>
  </div>
  <div v-else class="flex flex-row min-h-screen justify-center items-center">
    <span class="loading loading-spinner loading-xl"></span>
  </div>
</template>
