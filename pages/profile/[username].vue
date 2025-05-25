<script setup>
// STORES
const route = useRoute();
// COMPOSABLES
const usernameRef = computed(() => route.params.username);
const { openModal, activePost, closeModal } = useModal();
const { profile, posts, loadingProfile, isOwnProfile, fallbackImage } =
  useUserProfileData(usernameRef);
</script>

<template>
  <!-- Post Modal -->
  <ModalPostModal :post="activePost" @close="closeModal" />

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
      <!-- Public Profile picture-->
      <MyprofilePicture
        :src="profile.profilePicture || fallbackImage"
        :navigateToPath="`/profile/${profile.username}`"
        :altText="'User profile picture'"
        :sizeClasses="'w-32 h-32'"
      />
      <!-- Public Profile name + username-->
      <PublicprofileName :profile="profile" />

      <!-- Public Profile buttons-->
      <PublicprofileButtons :profile="profile" :isOwnProfile="isOwnProfile" />

      <!-- Public profile bio-->
      <PublicprofileBio :profile="profile" />

      <!--Stats (Followers, following, posts count)-->
      <PublicprofileStats :profile="profile" />
    </div>

    <!-- Public profile posts-->
    <PublicprofilePosts :posts="posts" />
    <!-- Public user account is private message-->
    <PublicprofilePrivate
      v-if="profile.isPrivate"
      :profile="profile"
      :loadingProfile="loadingProfile"
    />
    <!-- No posts-->
    <p v-if="posts.length < 1">No posts yet.</p>
  </div>
  <!-- USER DOES NOT EXIST PAGE-->
  <PageNotFound type="profile" v-else-if="!loadingProfile && !profile" />
</template>
