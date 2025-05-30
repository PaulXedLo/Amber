<script setup>
import { motion } from "motion-v";
const posts = usePostsStore();
const user = useUserStore();
const toast = useToast();
const fileInput = ref(null);
const isUploading = ref(null);
const postInformation = reactive({
  content: null,
  contentImage: null,
  postFeeling: "Feeling...",
});
const { fullName, profilePic } = storeToRefs(user);

function handleNewPicture(event) {
  const file = event.target?.files?.[0];
  if (file) {
    postInformation.contentImage = file;
  }
}

const previewPictureUrl = computed(() => {
  return postInformation.contentImage
    ? URL.createObjectURL(postInformation.contentImage)
    : null;
});
async function handleAddNewPost() {
  if (
    postInformation.content &&
    postInformation.contentImage &&
    postInformation.postFeeling &&
    postInformation.postFeeling !== "Feeling..."
  ) {
    try {
      isUploading.value = true;
      await posts.addPost(postInformation);
      await posts.fetchPosts();
      toast.success({
        message: "Added new post",
        timeout: 3000,
        position: "topRight",
      });
      handleCancelPost();
    } catch (error) {
      console.log(error);
      toast.error({
        message: "Could not add post",
        timeout: 3000,
        position: "topRight",
      });
    } finally {
      isUploading.value = false;
    }
  } else {
    toast.error({
      message: "Please add details to your post",
      timeout: 3000,
      position: "topRight",
    });
  }
}
function handleCancelPost() {
  postInformation.content = null;
  postInformation.contentImage = null;
  postInformation.postFeeling = "Feeling...";
  if (fileInput.value) {
    fileInput.value.value = null;
  }
}
</script>

<template>
  <div
    class="group w-full max-w-2xl mx-auto mt-8 bg-slate-900/80 border-r border-amber-500/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-amber-500/20 transition p-6 flex flex-col gap-6"
  >
    <div
      v-if="isUploading"
      class="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold animate-pulse"
    >
      Uploading...
    </div>
    <div class="flex items-start gap-4">
      <MyprofilePicture
        :src="user.profilePic"
        :navigateToPath="'/profile/me'"
        :altText="'User profile picture'"
      />
      <!-- Post content -->
      <textarea
        :placeholder="'What is on your mind, ' + fullName + '?'"
        class="flex-1 bg-transparent placeholder:text-[13px] md:placeholder:text-[15px] lg:placeholder:text-lg border border-slate-600 rounded-lg text-white p-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        rows="3"
        v-model="postInformation.content"
      />
    </div>

    <!-- Preview Image -->
    <div v-if="postInformation.contentImage">
      <NuxtImg
        :src="previewPictureUrl"
        alt="post image"
        densities="x1"
        class="w-full max-h-96 object-cover rounded-2xl border-amber-100"
      />
    </div>

    <div class="flex flex-row md:flex-row items-center gap-4">
      <!-- Image Upload -->
      <label
        class="flex items-center gap-2 cursor-pointer text-amber-400 hover:text-amber-300 transition"
      >
        <Icon name="mdi:camera-outline" size="24" />
        <span class="hidden md:block">Upload Image</span>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleNewPicture"
          class="hidden"
        />
      </label>

      <!-- Select Feeling -->
      <div class="relative">
        <select
          v-model="postInformation.postFeeling"
          class="cursor-pointer bg-slate-700 text-white text-[13px] rounded-md p-2 md:p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none"
        >
          <option disabled>Feeling...</option>
          <option>Happy 😊</option>
          <option>Excited 🎉</option>
          <option>Sad 😢</option>
          <option>Angry 😡</option>
          <option>Chill 😎</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-1 flex items-center text-slate-400"
        >
          <Icon name="mdi:chevron-down" size="20" />
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 ml-auto">
        <button
          v-if="postInformation.content"
          @click="handleCancelPost"
          class="cursor-pointer px-5 py-2 text-[13px] bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-full transition shadow-md"
        >
          Cancel
        </button>
        <motion.button
          :whileHover="{ scale: 1.05 }"
          :whilePress="{ scale: 0.95 }"
          @click="handleAddNewPost"
          class="px-5 py-2 cursor-pointer text-[13px] bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition shadow-md"
        >
          Post
        </motion.button>
      </div>
    </div>
  </div>
</template>
