<script setup lang="ts">
import type { Post, Profile } from "@/types/post";

defineProps<{
  userInfo: Profile;
  postInfo: Post;
  activePostId: string;
}>();

const emit = defineEmits([
  "deletePost",
  "reportPost",
  "toggleOptions",
  "close",
]);

const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";

function goToProfile(username: string) {
  navigateTo(username === "me" ? "/profile/me" : `/profile/${username}`);
}
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <div class="flex items-center gap-4">
      <!-- Profile Picture -->
      <NuxtImg
        :src="userInfo.profilePicture || fallbackImage"
        @click="goToProfile(userInfo.username)"
        class="w-12 h-12 rounded-full cursor-pointer object-cover border border-gray-700 hover:border-amber-500 transition"
      />
      <!-- User Info -->
      <div @click="goToProfile(userInfo.username)" class="cursor-pointer">
        <h3 class="font-bold text-lg hover:text-amber-400">
          {{ userInfo.fullName }}
        </h3>
        <p class="text-gray-400 text-sm">@{{ userInfo.username }}</p>
      </div>
    </div>
    <div class="relative">
      <!-- Options Icon -->
      <Icon
        name="octicon:kebab-horizontal-16"
        size="24"
        class="cursor-pointer text-gray-400 hover:text-white"
        @click="$emit('toggleOptions')"
      />
      <Options
        :showPostOptions="activePostId === postInfo.id"
        :profileId="userInfo.id"
        @reportPost="$emit('reportPost')"
        @deletePost="$emit('deletePost')"
        @close="$emit('close')"
      />
    </div>
  </div>
</template>
