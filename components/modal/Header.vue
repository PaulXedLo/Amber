<script setup lang="ts">
import type { PostWithProfile } from "@/types/post";
import { useModal } from "@/composables/useModal";

const props = defineProps<{
  post: PostWithProfile;
}>();

const {
  activePostOptionsId,
  togglePostOptions,
  handleDeletePost,
  handleReport,
  closeModal,
} = useModal();

const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
</script>

<template>
  <div class="flex justify-between items-start">
    <!-- Left: Profile -->
    <div class="flex items-center gap-3">
      <MyprofilePicture
        :src="post.profiles.profilePicture || fallbackImage"
        :navigateToPath="`/profile/${post.profiles.username}`"
        :altText="'Profile Picture'"
        @click="closeModal"
      />
      <div>
        <NuxtLink
          :to="`/profile/${post.profiles.username}`"
          @click="closeModal"
        >
          <h2 class="font-semibold text-sm text-white">
            {{ post.profiles.fullName }}
            <span v-if="post.posts.feeling" class="text-xs text-slate-400 ml-1">
              - {{ post.posts.feeling }}
            </span>
          </h2>
          <p class="text-xs text-slate-400">@{{ post.profiles.username }}</p>
        </NuxtLink>
      </div>
    </div>

    <!-- Right: Options -->
    <div class="relative bottom-2 flex gap-2 items-center">
      <Icon
        name="weui:more-filled"
        class="text-white cursor-pointer"
        size="24"
        @click="togglePostOptions(post.posts.id)"
      />
      <Options
        :showPostOptions="activePostOptionsId === post.posts.id"
        :profileId="post.profiles.id"
        @deletePost="() => handleDeletePost()"
        @reportPost="handleReport"
      />
      <button
        @click="closeModal"
        class="text-white cursor-pointer text-2xl hover:text-amber-400"
      >
        <Icon name="emojione-v1:large-orange-diamond" />
      </button>
    </div>
  </div>
</template>
