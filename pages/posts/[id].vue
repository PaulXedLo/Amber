<script setup>
definePageMeta({ layout: "default" });
const toast = useToast();
const route = useRoute();
// STORES
const posts = usePostsStore();
const user = useUserStore();
const { userId } = storeToRefs(user);
const loading = ref(true);
const postInfo = ref(null);
const userInfo = ref(null);
let showComments = ref(false);
let commentText = ref("");
let comments = ref([]);
// ADD NEW COMMENT

async function handleAddNewComment() {
  if (!commentText.value) return;
  try {
    await $fetch("/api/posts/comment", {
      method: "POST",
      body: {
        userId: userId.value,
        postId: postInfo.value.id,
        commentText: commentText.value,
      },
    });
    comments.value.push({
      commentText: commentText.value,
      commentCreatedAt: new Date().toISOString(),
      username: user.username,
      profilePicture: user.profilePic,
    });
    postInfo.commentsCount++;
    commentText.value = "";
    toast.success({
      title: "Success",
      message: "Added new comment",
      timeout: 3000,
      position: "topCenter",
    });
  } catch (error) {
    console.log("Error: Failed to post comment", error);
    toast.error({
      title: "Error",
      message: "Could not add comment",
      timeout: 3000,
      position: "topCenter",
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
    comments.value = await posts.fetchComments(route.params.id);
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
    class="flex flex-col h-100vh w-full p-5 sm:p-10"
  >
    <div class="flex flex-col justify-center items-center h-full w-full gap-2">
      <!-- HEADER -->
      <div
        class="flex flex-row justify-between w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mb-5"
      >
        <div class="flex flex-row gap-3 sm:gap-4 items-center">
          <NuxtImg
            @click="goToProfile(userInfo.username)"
            v-if="userInfo.profilePicture"
            :src="userInfo.profilePicture"
            class="rounded-full w-10 h-10 cursor-pointer"
          />
          <div class="flex flex-col">
            <h3 class="font-bold text-sm sm:text-base text-white">
              {{ userInfo.fullName }}
            </h3>
            <h3 class="text-xs sm:text-sm text-gray-400 cursor-pointer">
              {{ userInfo.username }}
            </h3>
          </div>
        </div>
        <div class="flex items-center">
          <Icon name="octicon:kebab-horizontal-16" size="24" />
        </div>
      </div>

      <!-- POST DESCRIPTION -->
      <div class="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mb-2">
        <h3 class="text-sm sm:text-base md:text-lg">
          {{ postInfo.contentText }}
        </h3>
      </div>

      <!-- POST IMAGE -->
      <div
        class="w-full shadow-md max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl"
      >
        <NuxtImg
          v-if="postInfo.contentImage"
          class="rounded-md w-full"
          :src="postInfo.contentImage"
        />
      </div>

      <div
        class="flex flex-col sm:flex-row justify-between w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mt-5 gap-4 sm:gap-0"
      >
        <!-- Likes and Comments -->
        <div class="flex flex-row items-center gap-5">
          <div class="flex flex-row items-center gap-1">
            <Icon name="system-uicons:heart" size="32" class="cursor-pointer" />
            <h3 class="text-sm sm:text-base">{{ postInfo.likesCount }}</h3>
          </div>
          <div class="flex flex-row items-center gap-1">
            <Icon
              @click="showComments = !showComments"
              name="system-uicons:speech-typing"
              size="32"
              class="cursor-pointer"
            />
            <h3 class="text-sm sm:text-base">{{ postInfo.commentsCount }}</h3>
          </div>
        </div>

        <!-- Comment Input -->
        <div
          class="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto"
        >
          <NuxtImg :src="user.profilePic" class="rounded-full w-10 h-10" />
          <input
            type="text"
            v-model="commentText"
            class="w-full sm:min-w-[150px] h-10 border-b-2 focus:outline-0 p-3 active:border-b-2 hover:border-amber-200 bg-transparent text-white placeholder-gray-400"
            placeholder="Add a new comment"
          />
          <button
            type="button"
            @click="handleAddNewComment"
            class="w-full sm:w-auto px-4 h-10 cursor-pointer hover:text-gray-200 active:translate-y-0.5 bg-amber-500 text-white font-semibold rounded-2xl hover:bg-amber-600 transition shadow hover:shadow-lg"
          >
            Send
          </button>
        </div>
      </div>

      <!-- COMMENTS SECTION -->
      <Comments v-if="showComments" :comments="comments" />
    </div>
  </div>
</template>
