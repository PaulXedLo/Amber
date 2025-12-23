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
  <div class="w-full flex justify-between items-center">
    <div class="flex items-center gap-3">
      <MyprofilePicture
        :src="post.profiles.profilePicture || fallbackImage"
        :navigateToPath="`/profile/${post.profiles.username}`"
        :altText="'Profile Picture'"
        :sizeClasses="'w-10 h-10'"
        @click="closeModal"
      />
      <div>
        <NuxtLink
          :to="`/profile/${post.profiles.username}`"
          @click="closeModal"
        >
          <h2 class="font-semibold text-sm text-white hover:underline">
            {{ post.profiles.fullName }}
            <span v-if="post.posts.feeling" class="text-xs text-slate-400 ml-1">
              - {{ post.posts.feeling }}
            </span>
          </h2>
          <p class="text-xs text-slate-400">@{{ post.profiles.username }}</p>
        </NuxtLink>
      </div>
    </div>

    <div class="flex gap-4 items-center">
      <div class="relative">
        <Icon
          name="weui:more-filled"
          class="text-slate-400 hover:text-white cursor-pointer transition-colors"
          size="24"
          @click.stop="togglePostOptions(post.posts.id)"
        />
        <Options
          :showPostOptions="activePostOptionsId === post.posts.id"
          :profileId="post.profiles.id"
          @deletePost="() => handleDeletePost()"
          @reportPost="handleReport"
        />
      </div>

      <button
        @click="closeModal"
        class="text-slate-400 hover:text-amber-400 cursor-pointer text-2xl transition-colors flex items-center"
      >
        <Icon name="emojione-v1:large-orange-diamond" />
      </button>
    </div>
  </div>
</template>
