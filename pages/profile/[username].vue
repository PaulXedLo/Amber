<script setup>
import { usePublicStore } from "~/stores/profile/public";
// REFS
const publicStore = usePublicStore();
const loadingProfile = ref(false);
const route = useRoute();
const user = useUserStore();
let posts = ref({});
const loadingFollow = ref(false);
const {
  username,
  fullName,
  bio,
  userId,
  isFollowing,
  followingCount,
  followersCount,
  profilePic: profilePicture,
  postsCount,
} = storeToRefs(publicStore);

// MODAL
const { openModal, activePost, closeModal, isOpen } = useModal();

// FOLLOW / UNFOLLOW USER
async function handleFollowClick() {
  if (loadingFollow.value) return;
  loadingFollow.value = true;
  try {
    if (!isFollowing.value) {
      await $fetch("/api/profile/follow", {
        method: "POST",
        body: { userId: user.userId, followingUserId: userId.value },
      });
      isFollowing.value = true;
      followersCount.value++;
    } else {
      await $fetch("/api/profile/follow", {
        method: "DELETE",
        body: { userId: user.userId, followingUserId: userId.value },
      });
      isFollowing.value = false;
      followersCount.value = Math.max(followersCount.value - 1, 0);
    }
  } catch (error) {
    console.log("Could not toggle follow", error);
    throw new Error("Failed to follow/unfollow");
  } finally {
    loadingFollow.value = false;
  }
}

// HOOKS
onBeforeMount(async () => {
  try {
    loadingProfile.value = true;
    const { profileInfo, posts: postsList } =
      await publicStore.fetchPublicProfile(route.params.username);
    posts.value = postsList;
    if (route.params.username === user.username) {
      return navigateTo("/profile/me");
    }
  } catch (error) {
    console.error(error);
    navigateTo("/home");
  } finally {
    loadingProfile.value = false;
  }
});
</script>

<template>
  <PostModal v-if="isOpen" :post="activePost" @close="closeModal" />
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
            :src="profilePicture || '/default-avatar.png'"
            alt="Profile Picture"
            class="object-cover w-full h-full"
          />
        </div>
      </div>
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold">{{ fullName }}</h1>
        <h1 class="text-1xl">@{{ username }}</h1>
      </div>

      <div class="flex gap-3 mt-2">
        <button
          @click="handleFollowClick"
          :disabled="loadingFollow"
          class="cursor-pointer px-4 py-2 rounded-full transition text-white font-semibold shadow hover:shadow-lg disabled:opacity-50"
          :class="
            isFollowing
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-amber-500 hover:bg-amber-600'
          "
        >
          {{ isFollowing ? "Unfollow" : "Follow" }}
        </button>
        <button
          class="cursor-pointer px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
        >
          Message
          <Icon name="eva:message-circle-fill" size="12" />
        </button>
      </div>

      <h3 class="text-1xl">{{ bio }}</h3>

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
    <div class="grid grid-cols-3 gap-2 sm:gap-4 mt-10">
      <div
        v-for="post in posts"
        :key="post.id"
        class="w-full aspect-square overflow-hidden rounded-lg bg-slate-800 shadow-md hover:shadow-amber-500/20 transition"
      >
        <NuxtImg
          :src="post.contentImage"
          @click="openModal(post.id)"
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
