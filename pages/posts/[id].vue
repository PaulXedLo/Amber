<script setup>
definePageMeta({ layout: "default" });

import { useUserStore } from "~/stores/user";
const route = useRoute();
const user = useUserStore();
const post = ref(null);
const loading = ref(true);

// HOOKS
onMounted(async () => {
  try {
    const { post: postData } = await $fetch(`/api/posts/${route.params.id}`);
    post.value = postData;
  } catch (error) {
    console.error("Could not fetch post", error);
    navigateTo("/home");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen w-full px-4 pb-10">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-xl"></span>
    </div>

    <div
      v-else
      class="max-w-3xl mx-auto mt-12 animate__animated animate__fadeInUp animate__faster"
    >
      <!-- POST -->
      <div
        class="rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-lg p-6"
      >
        <!-- Post User Info -->
        <div class="flex items-center gap-4 mb-6">
          <div
            class="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400"
          >
            <NuxtImg
              :src="post.profilePicture || '/default-avatar.png'"
              alt="Profile"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 class="text-white font-bold text-lg leading-tight">
              {{ post.fullName || "Unknown User" }} -
              <span class="text-sm text-slate-400">{{ post.feeling }}</span>
            </h2>
            <p class="text-sm text-slate-400">
              @{{ post.username || "@unknown" }}
            </p>
          </div>
        </div>

        <!-- Post Content -->
        <p class="text-slate-300 mb-4">{{ post.contentText }}</p>
        <img
          v-if="post.contentImage"
          :src="post.contentImage"
          alt="Post Image"
          class="rounded-lg w-full object-cover mb-4"
        />

        <!-- Like / Share Buttons -->
        <div class="flex justify-between items-center mt-4 text-slate-400">
          <div class="flex items-center gap-4">
            <div
              class="flex items-center gap-2 cursor-pointer hover:text-amber-400"
            >
              <Icon name="noto:orange-heart" size="24" />
              <span class="font-semibold">{{ post.likesCount }}</span>
            </div>
            <div
              class="flex items-center gap-2 cursor-pointer hover:text-amber-400"
            >
              <Icon name="mdi:share" size="24" />
              <span class="font-semibold">Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
