<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useRoute, navigateTo } from "#app";
import { storeToRefs } from "pinia";
import { usePublicStore } from "~/stores/profile/public";
import { useUserStore } from "~/stores/user";
import { useFollow } from "~/composables/useFollow";
import { useModal } from "~/composables/useModal";

// STORES
const route = useRoute();
const publicStore = usePublicStore();
const userStore = useUserStore();

// LOCAL REFS FOR COMPONENT STATE
const profile = ref(null);
const posts = ref([]);
const loadingProfile = ref(true);
const loadingFollowAction = ref(false);

// COMPOSABLES
const { openModal, activePost, closeModal, isOpen } = useModal();
const {
  toggleFollowUser: execToggleFollow,
  checkIfFollowing: execCheckIfFollowing,
  loading: followComposableLoading,
} = useFollow();

// COMPUTED PROPERTIES FOR UI REACTIVITY
const isOwnProfile = computed(() => {
  return profile.value && userStore.username === profile.value.username;
});

const currentFollowStatus = computed(() => {
  if (
    !profile.value ||
    !profile.value.id ||
    !userStore.userId ||
    isOwnProfile.value
  ) {
    return "unfollowed";
  }
  return userStore.followStatus[profile.value.id] || "unfollowed";
});

const isCurrentlyFollowingOrPending = computed(() => {
  return (
    currentFollowStatus.value === "followed" ||
    currentFollowStatus.value === "pending"
  );
});

const followButtonText = computed(() => {
  if (isOwnProfile.value) return "Edit Profile";
  if (currentFollowStatus.value === "pending") return "Pending";
  if (currentFollowStatus.value === "followed") return "Unfollow";
  return "Follow";
});

// FOLLOW / UNFOLLOW USER ACTION
async function handleFollowClick() {
  if (
    loadingFollowAction.value ||
    !profile.value ||
    !profile.value.id ||
    isOwnProfile.value
  )
    return;

  loadingFollowAction.value = true;
  try {
    await execToggleFollow(profile.value.id, profile.value.isPrivate);
  } catch (error) {
    console.error("Error toggling follow in component:", error);
  } finally {
    loadingFollowAction.value = false;
  }
}

// LIFECYCLE HOOKS
onBeforeMount(async () => {
  loadingProfile.value = true;
  const routeUsername = route.params.username;

  if (userStore.username === routeUsername) {
    navigateTo("/profile/me");
    return;
  }

  try {
    const fetchedData = await publicStore.fetchPublicProfile(routeUsername);

    if (!fetchedData || !fetchedData.profiles) {
      console.error("Profile not found for username:", routeUsername);
      navigateTo("/home");
      return;
    }
    profile.value = fetchedData.profiles;
    posts.value = fetchedData.posts || [];

    if (userStore.userId && profile.value && profile.value.id) {
      await execCheckIfFollowing(profile.value.id);
    }
  } catch (error) {
    console.error("Error loading profile:", error);

    navigateTo("/home");
  } finally {
    loadingProfile.value = false;
  }
});
</script>

<template>
  <PostModal v-if="isOpen" :post="activePost" @close="closeModal" />

  <div
    v-if="loadingProfile"
    class="flex flex-row min-h-screen justify-center items-center"
  >
    <span class="loading loading-spinner loading-xl"></span>
  </div>

  <div
    v-else-if="profile"
    class="max-w-4xl mx-auto px-4 mt-10 animate__animated animate__fadeInUp animate__faster"
  >
    <div class="flex flex-col items-center gap-4">
      <div class="avatar">
        <div
          class="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-md"
        >
          <NuxtImg
            width="128"
            height="128"
            densities="x1"
            :src="profile.profilePicture || '/default-avatar.png'"
            alt="Profile Picture"
            class="object-cover w-full h-full"
            format="webp"
            quality="80"
          />
        </div>
      </div>
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold">{{ profile.fullName }}</h1>
        <h1 class="text-1xl">@{{ profile.username }}</h1>
      </div>

      <div class="flex gap-3 mt-2">
        <button
          v-if="!isOwnProfile"
          @click="handleFollowClick"
          :disabled="loadingFollowAction || followComposableLoading"
          class="cursor-pointer px-4 py-2 rounded-full transition text-white font-semibold shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          :class="
            isCurrentlyFollowingOrPending
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-amber-500 hover:bg-amber-600'
          "
        >
          {{ followButtonText }}
        </button>
        <button
          v-if="isOwnProfile"
          @click="navigateTo('/settings/profile')"
          class="cursor-pointer px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
        >
          Edit Profile
        </button>
        <button
          v-if="!isOwnProfile"
          class="cursor-pointer px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
        >
          Message
          <Icon name="eva:message-circle-fill" size="12" />
        </button>
      </div>

      <h3 v-if="profile.bio" class="text-1xl mt-2 text-center max-w-md">
        {{ profile.bio }}
      </h3>

      <div class="flex justify-center gap-10 mt-6">
        <div class="text-center">
          <h2 class="text-lg font-bold">Followers</h2>
          <p class="text-slate-400">{{ profile.followersCount || 0 }}</p>
        </div>
        <div class="text-center">
          <h2 class="text-lg font-bold">Following</h2>
          <p class="text-slate-400">{{ profile.followingCount || 0 }}</p>
        </div>
        <div class="text-center">
          <h2 class="text-lg font-bold">Posts</h2>
          <p class="text-slate-400">{{ profile.postsCount || 0 }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="posts && posts.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mt-10"
    >
      <div
        v-for="post in posts"
        :key="post.id"
        class="w-full aspect-square overflow-hidden rounded-lg bg-slate-800 shadow-md hover:shadow-amber-500/20 transition"
      >
        <NuxtImg
          :src="post.contentImage"
          @click="openModal(post.id)"
          alt="Post image"
          class="w-full h-full object-cover cursor-pointer transform hover:scale-105 transition duration-300 hover:opacity-80"
          densities="x1"
          format="webp"
          quality="75"
          loading="lazy"
        />
      </div>
    </div>
    <div
      v-else-if="!loadingProfile && profile"
      class="text-center mt-10 text-slate-400"
    >
      <p
        v-if="
          profile.isPrivate && !isCurrentlyFollowingOrPending && !isOwnProfile
        "
      >
        This account is private. Follow to see their posts.
      </p>
      <p v-else>No posts yet.</p>
    </div>
  </div>
  <div v-else-if="!loadingProfile && !profile" class="text-center mt-20">
    <h2 class="text-2xl font-semibold">Profile not found</h2>
    <p class="text-slate-400">
      The user @{{ route.params.username }} does not exist or there was an issue
      loading their profile.
    </p>
    <NuxtLink
      to="/home"
      class="mt-4 inline-block px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
      >Go Home</NuxtLink
    >
  </div>
</template>
