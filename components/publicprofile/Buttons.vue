<script setup lang="ts">
import type { Profile } from "~/types/post";
const user = useUserStore();
const { loading, getFollowButtonText, publicUserFollow } = useFollow();
defineProps<{
  profile: Profile;
  isOwnProfile: boolean;
}>();
</script>
<template>
  <div class="flex gap-3 mt-2">
    <button
      v-if="profile.id && user.userId"
      @click="
        async () =>
          await publicUserFollow(
            profile.id,
            profile.isPrivate as boolean,
            profile
          )
      "
      :disabled="loading"
      class="cursor-pointer px-4 py-2 rounded-full transition text-white font-semibold shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      :class="{
        'bg-slate-700 hover:bg-slate-600':
          user.followStatus[profile.id] === 'followed',
        'bg-slate-500 hover:bg-slate-400':
          user.followStatus[profile.id] === 'pending',
        'bg-amber-500 hover:bg-amber-600':
          user.followStatus[profile.id] === 'unfollowed' ||
          !user.followStatus[profile.id],
      }"
    >
      {{ getFollowButtonText(profile.id) }}
    </button>
    <button
      v-if="isOwnProfile"
      @click="navigateTo('/settings/profile')"
      class="cursor-pointer px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold shadow hover:shadow-lg"
    >
      Edit Profile
    </button>
    <button
      v-if="
        profile.id &&
        user.userId &&
        !isOwnProfile &&
        user.followStatus[profile.id] === 'followed'
      "
      class="cursor-pointer px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 transition text-white font-semibold shadow hover:shadow-lg"
    >
      Message
      <Icon name="eva:message-circle-fill" size="12" />
    </button>
  </div>
</template>
