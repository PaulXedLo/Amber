<script setup lang="ts">
import { motion } from "motion-v";
// TYPESCRIPT TYPES
import type { PostWithProfile } from "~/types/post";
interface Props {
  postItemData: PostWithProfile;
  currentUserId?: string | null;
  followStatusOfPostAuthor?: string;
  followButtonTextContent?: string;
}

// PROPS & EMITS
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "toggle-like-post", postItemData: PostWithProfile): void;
  (
    e: "trigger-follow-user",
    payload: {
      targetUserId: string;
      isPrivate: boolean;
      profile: any;
    }
  ): void;
}>();

// EMIT LIKE POST FUNCTION
// This function emits an event to toggle the like status of a post.
function onLikeClick() {
  emit("toggle-like-post", props.postItemData);
}
// EMIT FOLLOW USER FUNCTION
// This function emits an event to follow or unfollow a user.
function onFollowClick() {
  const { profiles } = props.postItemData;
  if (profiles?.id) {
    emit("trigger-follow-user", {
      targetUserId: profiles.id,
      isPrivate: profiles.isPrivate || false,
      profile: profiles,
    });
  }
}
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, scale: 0.4 }"
    :whileInView="{
      opacity: 1,
      scale: 1,
      boxShadow: [
        '0px 0px 8px rgba(251,191,36,0.3)',
        '0px 0px 16px rgba(251,191,36,0.6)',
        '0px 0px 8px rgba(251,191,36,0.3)',
      ],
    }"
    :transition="{
      default: { duration: 0.5, ease: 'easeOut' },
      boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    }"
    :viewport="{ margin: '-100px' }"
    class="w-full max-w-2xl rounded-2xl bg-slate-900/80 border-r border-amber-500/10 backdrop-blur-md p-6"
  >
    <!--POST HEADER-->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4">
        <ProfilePicture
          :src="postItemData.profiles.profilePicture || ''"
          :navigateToPath="`/profile/${postItemData.profiles.username}`"
          :altText="'User profile picture'"
        />
        <div>
          <h2 class="text-white text-sm font-bold md:text-md leading-tight">
            {{ postItemData.profiles.fullName || "Unknown User" }} -
            <span class="text-xs md:text-sm text-slate-400">{{
              postItemData.posts.feeling
            }}</span>
          </h2>
          <p
            class="text-xs md:text-sm text-slate-400 cursor-pointer"
            @click="navigateTo(`/profile/${postItemData.profiles.username}`)"
          >
            @{{ postItemData.profiles.username || "@unknown" }}
          </p>
        </div>
      </div>
      <button
        v-if="
          postItemData.profiles?.id &&
          currentUserId &&
          postItemData.profiles.id !== currentUserId
        "
        @click="onFollowClick"
        class="cursor-pointer px-4 py-1.5 rounded-md transition text-sm text-white font-semibold shadow-sm hover:shadow-md"
        :class="{
          'bg-slate-700 hover:bg-slate-600':
            followStatusOfPostAuthor === 'followed',
          'bg-slate-500 hover:bg-slate-400':
            followStatusOfPostAuthor === 'pending',
          'bg-amber-500 hover:bg-amber-600':
            followStatusOfPostAuthor === 'unfollowed' ||
            !followStatusOfPostAuthor,
        }"
      >
        {{ followButtonTextContent }}
      </button>
    </div>

    <!-- POST CONTENT TEXT -->
    <p class="text-slate-300 text-sm md:text-lg mb-3">
      {{ postItemData.posts.contentText || "No content available" }}
    </p>

    <!-- POST IMAGE -->
    <motion.img
      :whileHover="{ scale: 1.05 }"
      v-if="postItemData.posts.contentImage"
      @click="navigateTo(`/posts/${postItemData.posts.id}`)"
      :src="postItemData.posts.contentImage"
      alt="Post Image"
      class="rounded-lg w-full h-80 object-contain mb-4"
    />

    <!-- POST ACTIONS: LIKES AND COMMENTS -->
    <div class="flex items-center gap-6">
      <button
        @click.prevent="onLikeClick"
        class="cursor-pointer flex items-center gap-3 text-slate-300 hover:text-amber-400 transition"
      >
        <motion.span :whileHover="{ scale: 1.05 }" :whilePress="{ scale: 1.2 }">
          <Icon
            :name="
              postItemData.posts.likedByMe
                ? 'noto:orange-heart'
                : 'noto:white-heart'
            "
            size="30"
          />
        </motion.span>
        <span class="font-bold text-l">{{
          postItemData.posts.likesCount || 0
        }}</span>
      </button>
      <button
        @click="navigateTo(`/posts/${postItemData.posts.id}`)"
        class="cursor-pointer flex items-center gap-3 text-slate-300 hover:text-blue-400 transition"
      >
        <motion.span :whileHover="{ scale: 1.05 }" :whilePress="{ scale: 1.2 }">
          <Icon name="uil:comment" size="30" />
        </motion.span>
        <span class="font-bold text-l">{{
          postItemData.posts.commentsCount || 0
        }}</span>
      </button>
    </div>

    <!-- DISPLAY COMMENT (IF ANY) -->
    <p
      v-if="postItemData.displayComment"
      class="flex items-center gap-3 text-slate-400 text-sm mt-3 italic"
    >
      <ProfilePicture
        :src="postItemData.profiles.profilePicture || ''"
        :navigateToPath="`/profile/${postItemData.profiles.username}`"
        :altText="'User profile picture'"
        :sizeClasses="'w-8 h-8 rounded-full'"
      />
      {{ postItemData.displayComment }}
    </p>
  </motion.div>
</template>
