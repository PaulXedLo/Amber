<script setup>
definePageMeta({ layout: "default" });
const toast = useToast();
const { comments, fetchComments, addComment, loading } = useComments();
const route = useRoute();
// STORES
const user = useUserStore();
const { userId } = storeToRefs(user);
const postInfo = ref(null);
const userInfo = ref(null);
let showComments = ref(false);
let commentText = ref("");

// ADD NEW COMMENT
async function handleAddNewComment() {
  if (!commentText.value) return;
  try {
    await addComment(userId.value, route.params.id, commentText.value);
    postInfo.value.commentsCount++;
    commentText.value = "";
    toast.success({
      message: "Comment added successfully",
      position: "topRight",
      timeout: 3000,
    });
  } catch (error) {
    console.log("Error adding comment", error);
    toast.error({
      message: "Could not add comment",
      position: "topRight",
      timeout: 3000,
    });
  }
}

// VISIT PROFILE
function goToProfile(value) {
  if (value === user.username) {
    return navigateTo(`/profile/me`);
  } else {
    return navigateTo(`/profile/${value}`);
  }
}
// HOOKS
onBeforeMount(async () => {
  // GET POST AND PROFILE INFORMATION
  try {
    const { post, profile } = await $fetch(`/api/posts/${route.params.id}`);
    postInfo.value = post;
    userInfo.value = profile;
  } catch (error) {
    console.error("Could not fetch post", error);
    navigateTo("/home");
  } finally {
    loading.value = false;
  }
});
onMounted(async () => {
  // GET COMMENTS FOR POST
  try {
    await fetchComments(route.params.id);
  } catch (error) {
    console.log(error);
    toast.error({
      message: "Could not get comments for this post",
      position: "topCenter",
      timeout: 3000,
    });
  }
});
</script>

<template>
  <div
    v-if="postInfo && userInfo"
    class="flex flex-col min-h-screen w-full text-white py-10 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="flex flex-col items-center bg-gray-900 p-10 rounded-2xl w-full max-w-3xl mx-auto gap-6"
    >
      <!-- HEADER -->
      <div class="flex flex-row justify-between items-center w-full mb-6">
        <div class="flex flex-row gap-3 sm:gap-4 items-center">
          <NuxtImg
            @click="goToProfile(userInfo.username)"
            v-if="userInfo.profilePicture"
            :src="userInfo.profilePicture"
            class="rounded-full w-10 h-10 sm:w-12 sm:h-12 cursor-pointer object-cover border-2 border-gray-700 hover:border-amber-500 transition"
          />
          <div class="flex flex-col">
            <h3
              @click="goToProfile(userInfo.username)"
              class="font-bold text-sm sm:text-base text-white cursor-pointer hover:text-amber-400 transition"
            >
              {{ userInfo.fullName }}
            </h3>
            <h3
              @click="goToProfile(userInfo.username)"
              class="text-xs sm:text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition"
            >
              @{{ userInfo.username }}
            </h3>
          </div>
        </div>
        <div
          class="flex items-center text-gray-400 hover:text-white cursor-pointer"
        >
          <Icon name="octicon:kebab-horizontal-16" size="24" />
        </div>
      </div>

      <!-- POST DESCRIPTION -->
      <div class="w-full mb-4">
        <h3 class="text-sm sm:text-base md:text-lg text-gray-300">
          {{ postInfo.contentText }}
        </h3>
      </div>

      <!-- POST IMAGE -->
      <div
        v-if="postInfo.contentImage"
        class="w-full shadow-lg rounded-lg overflow-hidden bg-gray-800"
      >
        <NuxtImg
          class="w-full h-auto object-cover"
          :src="postInfo.contentImage"
          alt="Post image"
        />
      </div>

      <!-- ACTIONS & COMMENT INPUT -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center w-full mt-6 gap-6"
      >
        <!-- Likes and Comments Icons -->
        <div class="flex flex-row items-center gap-5">
          <div class="flex flex-row items-center gap-1 text-gray-400">
            <Icon
              name="system-uicons:heart"
              size="32"
              class="cursor-pointer hover:text-red-500 transition"
            />
            <h3 class="text-sm sm:text-base text-white">
              {{ postInfo.likesCount }}
            </h3>
          </div>
          <div class="flex flex-row items-center gap-1 text-gray-400">
            <Icon
              @click="showComments = !showComments"
              name="system-uicons:speech-typing"
              size="32"
              class="cursor-pointer hover:text-amber-400 transition"
            />
            <h3 class="text-sm sm:text-base text-white">
              {{ postInfo.commentsCount }}
            </h3>
          </div>
        </div>

        <!-- Comment Input -->
        <div
          class="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto"
        >
          <NuxtImg
            :src="user.profilePic"
            class="rounded-full w-10 h-10 hidden sm:block object-cover border border-gray-700"
          />
          <input
            type="text"
            v-model="commentText"
            class="w-full sm:min-w-[200px] h-10 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 p-3 bg-gray-800 text-white placeholder-gray-500 rounded-md transition"
            placeholder="Add a comment..."
          />
          <button
            type="button"
            @click="handleAddNewComment"
            class="w-full sm:w-auto px-5 h-10 cursor-pointer hover:text-gray-100 active:translate-y-0.5 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 transition shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!commentText.trim()"
          >
            Send
          </button>
        </div>
      </div>

      <!-- COMMENTS SECTION -->
      <Comments v-if="showComments" class="w-full mt-8" />
    </div>
  </div>
  <div v-else class="flex justify-center items-center min-h-screen bg-gray-900">
    <!-- Optional: Add a loading spinner or message -->
    <p class="text-white">Loading post...</p>
  </div>
</template>
