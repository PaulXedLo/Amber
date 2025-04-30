<script setup>
const route = useRoute();
const { comments, fetchComments, loading } = useComments();
onMounted(async () => {
  await fetchComments(route.params.id);
});
</script>
<template>
  <LoadingSpinner v-if="loading" class="w-full h-96" />
  <div
    v-else
    class="flex flex-col w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mt-4 gap-4"
  >
    <div
      v-for="comment in comments"
      :key="comment"
      class="flex flex-row w-full items-start gap-3 p-4 bg-gradient-to-r border-b-0 border-t-0 from-slate-900/90 to-slate-900/70 backdrop-blur-md border border-amber-500/20"
    >
      <NuxtImg
        class="rounded-full w-8 sm:w-10 h-8 sm:h-10"
        :src="comment.profilePicture"
      />
      <div class="flex flex-col">
        <div class="flex flex-row gap-6">
          <h3 class="font-bold text-xs sm:text-sm text-white">
            {{ comment.username }}
          </h3>
          <h4 class="text-xs text-gray-400">
            <NuxtTime :datetime="comment.commentCreatedAt" relative />
          </h4>
        </div>
        <h2 class="text-sm sm:text-base text-gray-300">
          {{ comment.commentText }}
        </h2>
      </div>
    </div>
  </div>
</template>
