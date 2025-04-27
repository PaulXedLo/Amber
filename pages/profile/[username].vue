<script setup>
const user = useUserStore();
const userProfile = ref({});
const loadingProfile = ref(false);
const followersCount = ref(0);
const followingCount = ref(0);
const route = useRoute();
const loadingFollow = ref(false);

const handleFollowClick = async () => {
  if (!userProfile.value.id) return;
  loadingFollow.value = true;
  if (!user.followStatus[userProfile.value.id]) {
    await user.followUser(userProfile.value.id);
  } else {
    await user.unfollowUser(userProfile.value.id);
  }
  const { followers, following } = await user.fetchFollowersAndFollowingCount(
    userProfile.value.id
  );
  followersCount.value = followers;
  followingCount.value = following;
  loadingFollow.value = false;
};

onBeforeMount(async () => {
  loadingProfile.value = true;
  const result = await user.fetchPublicProfile(route.params.username);
  if (result) {
    userProfile.value = result;
    const { followers, following } = await user.fetchFollowersAndFollowingCount(
      result.id
    );
    followersCount.value = followers;
    followingCount.value = following;
    loadingProfile.value = false;
  }
  if (route.params.username === user.username) {
    return navigateTo("/profile/myprofile");
  }
});
onMounted(async () => {});
</script>

<template>
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
            :src="userProfile.profile_picture"
            alt="Profile Picture"
            class="object-cover w-full h-full"
          />
        </div>
      </div>

      <h1 class="text-2xl font-bold">@{{ userProfile.username }}</h1>
      <div class="flex gap-3 mt-2">
        <button
          @click="handleFollowClick"
          :disabled="loadingFollow"
          class="cursor-pointer px-4 py-2 rounded-full transition text-white font-semibold shadow hover:shadow-lg disabled:opacity-50"
          :class="
            user.followStatus[userProfile.id]
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-amber-500 hover:bg-amber-600'
          "
        >
          {{ user.followStatus[userProfile.id] ? "Unfollow" : "Follow" }}
        </button>
        <button
          class="cursor-pointer px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
        >
          Message
          <Icon name="eva:message-circle-fill" size="12" />
        </button>
      </div>
      <h3 class="text-1xl">{{ userProfile.bio }}</h3>

      <!-- Stats -->
      <div class="flex justify-center gap-10 mt-6">
        <div class="text-center">
          <h2 class="text-lg font-bold">Followers</h2>
          <p class="text-slate-400">{{ followersCount }}</p>
        </div>
        <div class="text-center">
          <h2 class="text-lg font-bold">Following</h2>
          <p class="text-slate-400">{{ 0 }}</p>
        </div>
        <div class="text-center">
          <h2 class="text-lg font-bold">Posts</h2>
          <p class="text-slate-400">0</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 sm:gap-4 mt-10">
      <div
        v-for="post in userProfile.post"
        :key="post.content_image"
        class="w-full aspect-square overflow-hidden rounded-lg bg-slate-800 shadow-md hover:shadow-amber-500/20 transition"
      >
        <NuxtImg
          :src="post.content_image"
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
