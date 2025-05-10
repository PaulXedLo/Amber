<script setup>
import { usePublicStore } from "~/stores/profile/public";
// STORES
const route = useRoute();
const toast = useToast();

const publicStore = usePublicStore();
const user = useUserStore();

// LOCAL REFS FOR COMPONENT STATE
const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
const profile = ref(null);
const posts = ref([]);
const loadingProfile = ref(true);

// COMPOSABLES
const { openModal, activePost, closeModal } = useModal();

const { toggleFollowUser, checkIfFollowing, loading } = useFollow();

const isOwnProfile = computed(() => {
  return (
    profile.value?.username &&
    user.username &&
    profile.value.username === user.username
  );
});

const getFollowButtonText = () => {
  if (!profile.value?.id) return "Follow";
  const status = user.followStatus[profile.value.id];
  if (status === "followed") return "Unfollow";
  if (status === "pending") return "Pending";
  return "Follow";
};

async function handleFollowClickOnProfile() {
  if (!profile.value?.id || !user.userId) {
    return;
  }

  try {
    await toggleFollowUser(profile.value.id, profile.value.isPrivate);
    if (user.followStatus[profile.value.id] === "followed") {
      toast.success({
        message: `Successfully followed ` + profile.value.fullName,
        timeout: 3000,
        position: "topRight",
      });
    } else if (user.followStatus[profile.value.id] === "pending") {
      toast.info({
        message: "Sent follow request",
        timeout: 3000,
        position: "topRight",
      });
    } else if (user.followStatus[profile.value.id] === "unfollowed") {
      toast.success({
        message: `Successfully unfollowed ` + profile.value.fullName,
        timeout: 3000,
        position: "topRight",
      });
    }
  } catch (error) {
    console.error("Error toggling follow in component:", error);
  }
}

// LIFECYCLE HOOKS
onBeforeMount(async () => {
  loadingProfile.value = true;
  const routeUsername = route.params.username;
  if (user.username === routeUsername) {
    navigateTo("/profile/me", { replace: true });
    return;
  }

  try {
    const fetchedData = await publicStore.fetchPublicProfile(routeUsername);

    if (!fetchedData || !fetchedData.profiles) {
      console.error("Profile not found for username:", routeUsername);
      profile.value = null;
      posts.value = [];
      loadingProfile.value = false;
      return;
    }
    profile.value = fetchedData.profiles;
    posts.value = fetchedData.posts || [];

    if (user.userId && profile.value?.id) {
      await checkIfFollowing(profile.value.id);
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    profile.value = null;
    posts.value = [];
  } finally {
    loadingProfile.value = false;
  }
});

// WATCHER for route changes
watch(
  () => route.params.username,
  async (newUsername, oldUsername) => {
    if (
      newUsername &&
      newUsername !== oldUsername &&
      typeof newUsername === "string"
    ) {
      profile.value = null;
      posts.value = [];
      loadingProfile.value = true;

      const routeUsername = newUsername;
      if (user.username === routeUsername) {
        navigateTo("/profile/me", { replace: true });
        return;
      }
      try {
        const fetchedData = await publicStore.fetchPublicProfile(routeUsername);
        if (!fetchedData || !fetchedData.profiles) {
          profile.value = null;
          posts.value = [];
        } else {
          profile.value = fetchedData.profiles;
          posts.value = fetchedData.posts || [];
          if (user.userId && profile.value?.id) {
            const stillNotOwnProfile = !(
              user.username && profile.value.username === user.username
            );
            if (stillNotOwnProfile) {
              await checkIfFollowing(profile.value.id);
            } else {
              navigateTo("/profile/me", { replace: true });
            }
          }
        }
      } catch (error) {
        console.error("Error loading profile on watch:", error);
        profile.value = null;
        posts.value = [];
      } finally {
        loadingProfile.value = false;
      }
    }
  }
);
</script>

<template>
  <PostModal :post="activePost" @close="closeModal" />

  <div
    v-if="loadingProfile"
    class="flex flex-row min-h-screen justify-center items-center"
  >
    <LoadingSpinner />
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
            :src="profile.profilePicture || fallbackImage"
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
          v-if="profile.id && user.userId"
          @click="handleFollowClickOnProfile"
          :disabled="loading"
          class="cursor-pointer px-4 py-2 rounded-full transition text-white font-semibold shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'bg-slate-700 hover:bg-slate-600':
              user.followStatus[profile.id] === 'followed',
            'bg-slate-500 hover:bg-slate-400':
              user.followStatus[profile.id] === 'pending',
            'bg-amber-500 hover:bg-amber-600':
              user.followStatus[profile.id] === 'unfollowed' ||
              !user.followStatus[profile.id],
          }"
        >
          {{ getFollowButtonText() }}
        </button>
        <button
          v-if="isOwnProfile"
          @click="navigateTo('/settings/profile')"
          class="cursor-pointer px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold shadow hover:shadow-lg"
        >
          Edit Profile
        </button>
        <button
          v-if="
            profile.id &&
            user.userId &&
            !isOwnProfile &&
            user.followStatus[profile.id] === 'followed'
          "
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
        v-for="postItem in posts"
        :key="postItem.id"
        class="w-full aspect-square overflow-hidden rounded-lg bg-slate-800 shadow-md hover:shadow-amber-500/20 transition"
      >
        <NuxtImg
          :src="postItem.contentImage || fallbackImage"
          @click="openModal(postItem.id)"
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
          profile.isPrivate && !(user.followStatus[profile.id] === 'followed')
        "
      >
        This account is private. Follow to see their posts.
      </p>
      <p v-else>No posts yet.</p>
    </div>
  </div>
  <!-- USER DOES NOT EXIST PAGE-->
  <ProfileNotFound v-else-if="!loadingProfile && !profile" />
</template>
