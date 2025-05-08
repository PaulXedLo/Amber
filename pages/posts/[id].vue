<script setup>
import "animate.css";
definePageMeta({ layout: "default" });
const toast = useToast();
const route = useRoute();
// STORES
const user = useUserStore();
// COMPOSABLES
const { comments, fetchComments, addComment, loading, deleteComment } =
  useComments();
const { sendReport } = useReport();
const { toggleLikePost } = useLikes();
// REFS
const { userId } = storeToRefs(user);
const postInfo = ref(null);
let showReport = ref(false);
let commentsCount = computed(() => comments.value.length);
const postId = computed(() => postInfo.value?.id);
const userInfo = ref(null);
const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
let showComments = ref(false);
let commentText = ref("");
let showCommentOptions = ref(null);
let activeCommentId = ref(null);
// LIKE POST
async function likePost(postInfo) {
  try {
    await toggleLikePost(postInfo.id, postInfo.likedByMe);
    postInfo.likedByMe = !postInfo.likedByMe;
    postInfo.likesCount += postInfo.likedByMe ? 1 : -1;
  } catch (error) {
    toast.error({
      message: "Failed to like post",
      position: "topRight",
      timeout: 3000,
    });
  }
}
// REPORT
async function handleReport() {
  try {
    await sendReport(userId.value, postId.value);
    toast.success({
      message: "Successfully reported",
      position: "topRight",
      timeout: 3000,
    });
    showReport.value = false;
    showCommentOptions.value = false;
  } catch (error) {
    toast.error({
      message: "Could not report post",
      position: "topRight",
      timeout: 3000,
    });
    showReport.value = false;
    showCommentOptions.value = false;
  }
}
// ADD NEW COMMENT
async function handleAddComment() {
  const content = commentText.value.trim();
  try {
    await addComment(userId.value, postId.value, content);
    commentText.value = "";
    activeCommentId.value = null;
    showCommentOptions.value = false;
    toast.success({
      message: "Comment added successfully",
      position: "topRight",
      timeout: 3000,
    });
  } catch (error) {
    toast.error({
      message: "Failed to add comment",
      position: "topRight",
      timeout: 3000,
    });
  }
  await fetchComments(postId.value);
}
// TOGGLE COMMENT OPTIONS
function toggleCommentOptions(commentId) {
  if (activeCommentId.value === commentId) {
    activeCommentId.value = null;
  } else {
    activeCommentId.value = commentId;
    showCommentOptions.value = true;
  }
}
// DELETE COMMENT
async function handleDeleteComment(commentId) {
  try {
    await deleteComment(commentId, postId.value);
    toast.success({
      message: "Comment deleted successfully",
      position: "topRight",
      timeout: 3000,
    });
    showCommentOptions.value = false;
    activeCommentId.value = null;
    // Refresh comments after deletion
    await fetchComments(postId.value);
  } catch (error) {
    toast.error({
      message: "Failed to delete comment",
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
    const { post, profile } = await $fetch(`/api/posts/${route.params.id}`, {
      query: { userId: userId.value },
    });
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
  console.log(commentsCount);
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
    class="flex flex-col min-h-screen w-full text-white py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="flex flex-col items-center bg-slate-900/80 p-8 sm:p-10 rounded-2xl w-full max-w-3xl mx-auto gap-8 shadow-xl border border-gray-800"
    >
      <!-- HEADER -->
      <div class="flex flex-row justify-between items-center w-full">
        <div class="flex flex-row gap-4 items-center group">
          <NuxtImg
            @click="goToProfile(userInfo.username)"
            :src="userInfo.profilePicture || fallbackImage"
            class="rounded-full w-12 h-12 sm:w-14 sm:h-14 cursor-pointer object-cover border-2 border-gray-700 group-hover:border-amber-500 transition-all duration-300 shadow-md hover:shadow-amber-500/20"
          />
          <div class="flex flex-col">
            <h3
              @click="goToProfile(userInfo.username)"
              class="font-bold text-base sm:text-lg text-white cursor-pointer hover:text-amber-400 transition-colors duration-300"
            >
              {{ userInfo.fullName }}
            </h3>
            <h3
              @click="goToProfile(userInfo.username)"
              class="text-sm text-gray-400 cursor-pointer hover:text-amber-300 transition-colors duration-300"
            >
              @{{ userInfo.username }}
            </h3>
          </div>
        </div>
        <div
          class="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors duration-300 p-2 hover:bg-gray-800 rounded-full"
        >
          <div class="relative">
            <Icon
              name="octicon:kebab-horizontal-16"
              size="24"
              @click="showReport = !showReport"
            />
            <div
              v-if="showReport"
              class="animate__animated animate__slideInDown absolute right-0 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-40 text-sm"
            >
              <button
                class="w-full hover:bg-gray-800 cursor-pointer px-4 py-2 text-left hover:text-white transition-colors duration-200"
                @click="handleReport"
              >
                Report Post 🚩
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- POST DESCRIPTION -->
      <div class="w-full">
        <h3
          class="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed"
        >
          {{ postInfo.contentText }}
        </h3>
      </div>

      <!-- POST IMAGE -->
      <div
        v-if="postInfo.contentImage"
        class="w-full shadow-xl rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-300"
      >
        <NuxtImg
          class="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
          :src="postInfo.contentImage"
          alt="Post image"
        />
      </div>

      <!-- ACTIONS & COMMENT INPUT -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center w-full gap-6 border-t border-gray-800 pt-6"
      >
        <!-- Likes and Comments Icons -->
        <div class="flex flex-row items-center gap-8">
          <div
            class="flex flex-row items-center gap-2 group cursor-pointer"
            @click="likePost(postInfo)"
          >
            <template v-if="postInfo.likedByMe"
              ><Icon name="noto:orange-heart" size="30"
            /></template>
            <template v-else
              ><Icon name="noto:white-heart" size="30"
            /></template>
            <h3 class="text-base font-medium text-white">
              {{ postInfo.likesCount }}
            </h3>
          </div>
          <div class="flex flex-row items-center gap-2 group">
            <Icon
              @click="showComments = !showComments"
              name="uil:comment"
              size="32"
              class="cursor-pointer text-gray-400 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300"
            />
            <h3
              class="text-base font-medium text-white group-hover:text-amber-400 transition-colors"
            >
              {{ commentsCount }}
            </h3>
          </div>
        </div>

        <!-- Comment Input -->
        <div
          class="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto"
        >
          <NuxtImg
            :src="user.profilePic"
            class="rounded-full w-10 h-10 hidden sm:block object-cover border border-gray-700 shadow-md"
          />
          <div class="flex flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              v-model="commentText"
              class="w-full sm:min-w-[250px] h-11 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 px-4 bg-gray-800/50 text-white placeholder-gray-500 rounded-lg transition-all duration-300"
              placeholder="Add a comment..."
            />
            <button
              type="button"
              @click="handleAddComment"
              class="px-6 h-11 cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              :disabled="!commentText.trim()"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <!-- COMMENTS SECTION -->
      <div
        class="flex-grow w-full overflow-y-auto max-h-[calc(110vh-450px)] p-1 rounded-lg bg-slate-800/50 mt-2 custom-scrollbar"
      >
        <!-- Loading state -->
        <LoadingSpinner v-if="loading" />
        <div
          v-else-if="!comments || comments.length === 0"
          class="text-center p-4 text-slate-500 flex flex-col items-center gap-4 mt-3 font-bold"
        >
          No comments yet.
          <span class="w-full"
            >Add a new comment if you want to be the first!</span
          >
        </div>
        <!-- Comments list -->
        <div v-else>
          <div
            v-for="comment in comments"
            :key="comment.commentId"
            class="flex items-start p-2 gap-3 hover:bg-slate-700/50 rounded-md"
          >
            <NuxtImg
              :src="comment.profilePicture || fallbackImage"
              class="w-8 h-8 rounded-full mt-1"
            />
            <div class="flex flex-row justify-between w-full items-center">
              <div class="flex flex-col">
                <p class="text-xs text-slate-400 mb-0.5">
                  <span class="font-semibold text-white">{{
                    comment.username
                  }}</span>
                  <span class="ml-2 text-slate-500"
                    ><NuxtTime :datetime="comment.commentCreatedAt" relative
                  /></span>
                </p>
                <h3 class="text-sm text-slate-200">
                  {{ comment.commentText }}
                </h3>
              </div>
              <div class="relative mt-1.25 w-10">
                <Icon
                  name="weui:more-filled"
                  class="cursor-pointer"
                  size="24"
                  @click="toggleCommentOptions(comment.commentId)"
                />
                <!--COMMENT OPTIONS-->
                <Options
                  @reportComment="handleReport"
                  @deleteComment="handleDeleteComment(comment.commentId)"
                  :showCommentOptions="activeCommentId === comment.commentId"
                  :comment="comment"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
