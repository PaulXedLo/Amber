<script setup>
import "animate.css";
definePageMeta({
  layout: "myprofile",
});
const { openModal, activePost, closeModal, isOpen } = useModal();
// USER PROFILE REFS

const loadingPosts = ref(false);
const posts = usePostsStore();
const loadingProfile = ref(true);
const user = useUserStore();
const {
  profilePic: profilePicture,
  username,
  fullName,
  bio,
  followersCount,
  followingCount,
  postsCount,
} = storeToRefs(user);

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
  <PostModal
    v-if="isOpen"
    :post="activePost"
    @close="closeModal"
    @likeUpdated="likeUpdated"
  />
  <div
    v-if="!loadingProfile"
    class="max-w-4xl mx-auto px-4 mt-10 animate__animated animate__fadeInUp animate__faster"
  >
    <!-- Profile header -->
    <div class="flex flex-col items-center gap-4">
      <div class="avatar">
        <div
          class="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-md"
        >
          <NuxtImg
            width="128"
            height="128"
            densities="x1"
            :src="profilePicture"
            alt="Profile Picture"
            class="object-cover w-full h-full"
          />
        </div>
      </div>

      <div class="flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold">{{ fullName }}</h1>
        <h1 class="text-1xl">@{{ username }}</h1>
      </div>

      <h3 class="text-1xl">{{ bio }}</h3>
      <!-- Profile options -->
      <div class="flex gap-6 mt-2">
        <NuxtLink
          to="/profile/settings/profilesettings"
          class="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow hover:shadow-lg"
        >
          Edit Profile
        </NuxtLink>
        <button
          class="px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
        >
          Share Profile
        </button>
      </div>

      <!-- Stats -->
      <div class="flex justify-center gap-10 mt-6">
        <div class="text-center">
          <h2 class="text-lg font-bold">Followers</h2>
          <p class="text-slate-400">{{ followersCount }}</p>
        </div>
        <div class="text-center">
          <h2 class="text-lg font-bold">Following</h2>
          <p class="text-slate-400">{{ followingCount }}</p>
        </div>
        <div class="text-center">
          <h2 class="text-lg font-bold">Posts</h2>
          <p class="text-slate-400">{{ postsCount }}</p>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->

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
