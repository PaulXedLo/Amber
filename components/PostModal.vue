<script setup>
import "animate.css";
import { onMounted, onBeforeUnmount } from "vue";
const toast = useToast();
const user = useUserStore();
const postsStore = usePostsStore();
// COMPOSABLES

const { toggleLikePost } = useLikes();
const { sendReport } = useReport();
const { comments, loading, fetchComments, deleteComment, addComment } =
  useComments();

// PROPS AND REFS
const emit = defineEmits(["close", "postRemoved"]);
const props = defineProps({ post: Object });
const postId = computed(() => props.post?.posts?.id);
const activeCommentId = ref(null);
const activePost = ref(null);
const showPostOptions = ref(false);
const { userId } = toRefs(user);
let commentInput = ref("");
const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";

// GO TO PROFILE

const navigateToProfile = (username) => {
  if (username === user.username) {
    navigateTo("/profile/me");
  } else {
    navigateTo(`/profile/${username}`);
  }
};

// LIKE POST FUNCTION

async function handleLikePost(postToLike) {
  if (!postToLike?.posts?.id) {
    console.error("Post ID is missing.");
    return;
  }
  if (!user.userId) {
    console.error("User is not logged in.");
    return;
  }

  const currentLikedStatus = postToLike.posts.likedByMe;

  try {
    await toggleLikePost(postToLike.posts.id, currentLikedStatus);
    postToLike.posts.likedByMe = !currentLikedStatus;
    postToLike.posts.likesCount += postToLike.posts.likedByMe ? 1 : -1;
  } catch (error) {
    console.error("Failed to toggle like:", error);
  }
}

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    handleAddComment();
  }
  if (event.key === "Escape") {
    commentInput.value = "";
    $emit("close");
  }
  if (event.key === "Tab") {
    event.preventDefault();
    commentInput.value = "";
  }
};

// HANDLE NEW COMMENT

async function handleAddComment() {
  if (commentInput.value == "" || !postId.value) {
    console.error("Cannot add comment");
    throw new Error("Comment input or postId is missing.");
  }
  if (!user.userId) {
    console.error("User is not logged in.");
    throw new Error("User is not logged in.");
  }
  const content = commentInput.value.trim();
  await addComment(user.userId, postId.value, content);
  commentInput.value = "";
  await fetchComments(postId.value);
}

// TOGGLE COMMENT OPTIONS

function toggleCommentOptions(commentId) {
  activePost.value = null;
  if (activeCommentId.value === commentId) {
    activeCommentId.value = null;
  } else {
    activeCommentId.value = commentId;
  }
}
// TOGGLE POST OPTIONS

function togglePostOptions(postId) {
  activeCommentId.value = null;
  if (activePost.value === postId) {
    activePost.value = null;
  } else {
    activePost.value = postId;
  }
}
// DELETE COMMENT

async function handleDeleteComment(commentId) {
  try {
    await deleteComment(commentId, postId.value);
    toast.success({
      message: "Comment deleted successfully.",
      timeout: 3000,
      position: "topCenter",
    });
    activeCommentId.value = null;
    await fetchComments(postId.value);
  } catch (error) {
    toast.error({
      message: "Failed to delete comment.",
      timeout: 3000,
      position: "topCenter",
    });
    activeCommentId.value = null;
  }
}

// DELETE POST

async function handleDeletePost() {
  try {
    const success = await postsStore.deletePost(postId.value);
    if (success) {
      activePost.value = null;
      emit("close");
      emit("postRemoved");
      toast.success({
        message: "Post deleted successfully.",
        timeout: 3000,
        position: "topCenter",
      });
    }
  } catch (error) {
    toast.error({
      message: "Failed to delete post.",
      timeout: 3000,
      position: "topCenter",
    });
  }
}

// HANDLE REPORT

async function handleReport() {
  try {
    await sendReport(userId.value, postId.value);
    toast.success({
      message: "Reported successfully.",
      timeout: 3000,
      position: "topCenter",
    });
    activeCommentId.value = null;
  } catch (error) {
    toast.error({
      message: "Failed to report.",
      timeout: 3000,
      position: "topCenter",
    });
    activeCommentId.value = null;
  }
}

// HOOKS

onMounted(async () => {
  document.body.classList.add("overflow-hidden");
  if (!postId.value) {
    console.error("Post ID is missing.");
    return;
  }
  await fetchComments(postId.value);
});

onBeforeUnmount(() => {
  document.body.classList.remove("overflow-hidden");
});
</script>
<template>
  <div
    class="fixed inset-0 z-50 p-4 sm:p-6 md:p-10 flex items-center justify-center bg-black/70"
  >
    <!--MODAL CONTENT-->
    <div
      v-if="post && post.profiles && post.posts"
      class="animate__animated animate__zoomIn animate__faster flex flex-col md:flex-row w-full h-full md:max-w-5xl md:h-[90vh] rounded-2xl overflow-hidden bg-slate-900"
    >
      <div
        class="block md:hidden p-4 bg-slate-900 border-b border-slate-800 relative flex flex-col gap-3"
      >
        <div class="flex justify-between items-start">
          <!-- Profile Info -->
          <div class="flex items-center gap-3">
            <NuxtLink
              @click="$emit('close')"
              :to="`/profile/${post.profiles.username}`"
            >
              <NuxtImg
                :src="post.profiles.profilePicture || fallbackImage"
                alt="Profile Picture"
                class="cursor-pointer w-10 h-10 rounded-full object-cover border-2 border-amber-400"
              />
            </NuxtLink>
            <div>
              <NuxtLink
                @click="$emit('close')"
                :to="`/profile/${post.profiles.username}`"
                class="cursor-pointer"
              >
                <h2 class="text-white font-semibold text-sm">
                  {{ post.profiles.fullName }}
                  <span class="text-xs text-slate-400 ml-1">{{
                    post.posts.feeling ? `- ${post.posts.feeling}` : ""
                  }}</span>
                </h2>
                <p class="text-xs text-slate-400">
                  @{{ post.profiles.username }}
                </p>
              </NuxtLink>
            </div>
          </div>
          <!-- Post Options & Close Button -->
          <div class="flex items-center gap-2">
            <Icon
              name="weui:more-filled"
              class="cursor-pointer text-white"
              size="25"
              @click="togglePostOptions(post.posts.id)"
            />

            <Options
              :showPostOptions="activePost === post.posts.id"
              :profileId="props.post.profiles.id"
              @reportPost="handleReport"
              @deletePost="handleDeletePost"
            />
            <button
              @click="$emit('close')"
              class="text-white text-2xl hover:text-amber-400 focus:outline-none"
            >
              <Icon
                name="emojione-v1:large-orange-diamond"
                class="cursor-pointer hover:opacity-80"
              />
            </button>
          </div>
        </div>
        <!-- Post Description (Moved into Mobile Header) -->
        <p
          class="text-sm text-slate-200 overflow-y-auto max-h-[60px] pr-2 custom-scrollbar"
        >
          {{ post.posts.contentText }}
        </p>
      </div>

      <!--LEFT SIDE (IMAGE)-->
      <div
        class="w-full h-[40vh] md:h-auto md:flex-1 flex items-center justify-center"
      >
        <NuxtImg
          :src="post.posts.contentImage"
          alt="Post Image"
          densities="x1"
          class="object-contain md:object-contain p-0.5 md:p-0 w-full h-full"
        />
      </div>

      <!--RIGHT SIDE (POST INFO)-->
      <div
        class="w-full md:w-[400px] lg:w-[450px] flex flex-col p-4 md:p-6 gap-3 md:gap-4 relative text-white flex-1 md:flex-initial md:h-full"
      >
        <div class="hidden md:flex flex-row">
          <!--POST OPTIONS-->
          <Icon
            name="weui:more-filled"
            class="cursor-pointer absolute top-4 right-14 text-white"
            size="25"
            @click="togglePostOptions(post.posts.id)"
          />
          <Options
            :showPostOptions="activePost === post.posts.id"
            :profileId="props.post.profiles.id"
            @reportPost="handleReport"
            @deletePost="handleDeletePost(post.posts.id)"
          />
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-white text-2xl hover:text-amber-400 focus:outline-none"
          >
            <Icon
              name="emojione-v1:large-orange-diamond"
              class="cursor-pointer hover:opacity-80"
            />
          </button>
        </div>
        <!-- Desktop: PROFILE INFO -->
        <div
          class="hidden md:flex items-center gap-3 pb-3 border-b md:border-slate-700"
        >
          <NuxtLink
            @click="$emit('close')"
            :to="`/profile/${post.profiles.username}`"
          >
            <NuxtImg
              :src="post.profiles.profilePicture || fallbackImage"
              alt="Profile Picture"
              class="cursor-pointer w-10 h-10 rounded-full object-cover border-2 border-amber-400"
            />
          </NuxtLink>
          <div>
            <NuxtLink
              @click="$emit('close')"
              :to="`/profile/${post.profiles.username}`"
              class="cursor-pointer"
            >
              <h2 class="text-white font-semibold text-sm">
                {{ post.profiles.fullName }}
                <span class="text-xs text-slate-400 ml-1">{{
                  post.posts.feeling ? `- ${post.posts.feeling}` : ""
                }}</span>
              </h2>
              <p class="text-xs text-slate-400">
                @{{ post.profiles.username }}
              </p>
            </NuxtLink>
          </div>
        </div>

        <!--Post description (Desktop)-->
        <p
          class="hidden md:block text-sm text-slate-200 overflow-y-auto md:max-h-[100px] lg:max-h-[120px] pr-2 custom-scrollbar"
        >
          {{ post.posts.contentText }}
        </p>

        <!--LIKES & COMMENT INPUT -->
        <div class="pt-2 md:pt-3 border-slate-700">
          <div class="flex items-center gap-4">
            <button
              @click="handleLikePost(post)"
              class="flex items-center gap-2 cursor-pointer text-white hover:text-amber-400 transition duration-200 focus:outline-none"
              aria-label="Toggle like"
            >
              <Icon
                v-if="post.posts.likedByMe"
                name="noto:yellow-heart"
                size="28"
              />
              <Icon v-else name="mdi:heart-outline" size="28" />
              <span class="text-sm font-medium">{{
                post.posts.likesCount
              }}</span>
            </button>
            <input
              type="text"
              v-model="commentInput"
              @keydown="handleKeyPress"
              placeholder="Add a comment..."
              class="flex-grow bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              @click="handleAddComment"
              :disabled="!commentInput.trim()"
              class="cursor-pointer font-semibold px-5 py-2 rounded-full bg-amber-500 text-white text-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>

        <!--COMMENTS SECTION-->
        <div
          class="flex-grow overflow-y-auto p-1 rounded-lg bg-slate-800/50 mt-2 custom-scrollbar"
        >
          <!-- Loading state -->
          <LoadingSpinner v-if="loading" />
          <div
            v-else-if="!comments || comments.length === 0"
            class="text-center p-4 text-slate-500 flex flex-col items-center gap-4 mt-3 font-bold"
          >
            No comments yet.
            <span
              >Add a new comment if you<br />
              want to be the first!</span
            >
          </div>
          <div v-else>
            <div
              v-for="comment in comments"
              :key="comment.id"
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
                    size="20"
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
  </div>
</template>
