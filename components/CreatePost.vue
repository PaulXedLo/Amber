<script setup>
const toast = useToast();
const posts = usePostsStore();
const user = useUserStore();
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
      toast.success("Successfully added a new post", {
        timeout: 2000,
        position: "top-center",
      });
      handleCancelPost();
    } catch (error) {
      console.log(error);
      toast.warning("Could not add post. Try again.", {
        timeout: 3500,
        position: "top-center",
      });
    } finally {
      isUploading.value = false;
    }
  } else {
    toast.warning("Please add post information", {
      timeout: 3500,
      position: "top-center",
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
    class="group w-full max-w-2xl mx-auto mt-8 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-md hover:shadow-amber-500/20 transition p-6 flex flex-col gap-6"
  >
    <div
      v-if="isUploading"
      class="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold animate-pulse"
    >
      Uploading...
    </div>
    <div class="flex items-start gap-4">
      <div
        class="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400"
      >
        <NuxtImg
          :src="profilePic"
          @click="navigateTo('/profile/myprofile')"
          alt="Profile"
          densities="x1"
          class="w-full cursor-pointer hover:opacity-40 h-full object-cover"
        />
      </div>

      <!-- Post content -->
      <textarea
        :placeholder="'What is on your mind, ' + fullName + '?'"
        class="flex-1 bg-transparent border border-slate-600 rounded-lg text-white p-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
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

    <div class="flex flex-col md:flex-row items-center gap-4">
      <!-- Image Upload -->
      <label
        class="flex items-center gap-2 cursor-pointer text-amber-400 hover:text-amber-300 transition"
      >
        <Icon name="mdi:camera-outline" size="24" />
        <span>Upload Image</span>
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
          class="cursor-pointer bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none"
        >
          <option disabled>Feeling...</option>
          <option>Happy 😊</option>
          <option>Excited 🎉</option>
          <option>Sad 😢</option>
          <option>Angry 😡</option>
          <option>Chill 😎</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400"
        >
          <Icon name="mdi:chevron-down" size="20" />
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 ml-auto">
        <button
          v-if="postInformation.content"
          @click="handleCancelPost"
          class="cursor-pointer px-5 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-full transition shadow-md"
        >
          Cancel
        </button>
        <button
          @click="handleAddNewPost"
          class="px-5 py-2 cursor-pointer bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full transition shadow-md"
        >
          Post
        </button>
      </div>
    </div>
  </div>
</template>
