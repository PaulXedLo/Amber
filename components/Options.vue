<script setup>
const user = useUserStore();
const { userId } = toRefs(user);
const props = defineProps({
  comment: {
    type: Object,
  },
  profileId: {
    type: String,
  },
  showCommentOptions: {
    type: Boolean,
  },
  showPostOptions: {
    type: Boolean,
  },
});

const emit = defineEmits([
  "deleteComment",
  "reportComment",
  "deletePost",
  "reportPost",
]);
</script>

<template>
  <div
    v-if="showCommentOptions"
    class="animate__animated items-center w-auto animate__fadeIn overflow-hidden absolute z-50 flex right-12 bottom-0 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg text-sm"
  >
    <button
      v-if="props.comment.userId === userId"
      @click="$emit('deleteComment')"
      type="button"
      class="animate__animated animate__slideInRight animate__faster p-2 w-auto h-full hover:bg-red-400 transition-colors cursor-pointer"
    >
      Delete
    </button>
    <button
      @click="$emit('reportComment')"
      type="button"
      class="animate__animated animate__slideInRight animate__faster p-2 w-auto h-full hover:bg-red-400 transition-colors cursor-pointer"
    >
      Report
    </button>
  </div>
  <div
    v-else
    class="class animate__animated items-center w-auto animate__fadeIn overflow-hidden absolute z-50 flex flex-col right-12 top-10 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg text-sm"
    :class="{ hidden: !showPostOptions }"
  >
    <button
      v-if="props.profileId === userId"
      @click="$emit('deletePost')"
      type="button"
      class="animate__animated animate__slideInDown animate__faster p-2 w-30 h-full hover:bg-red-400 transition-colors cursor-pointer"
    >
      Delete
    </button>
    <button
      v-if="props.profileId !== userId"
      @click="$emit('reportPost')"
      type="button"
      class="animate__animated animate__slideInDown animate__faster p-2 w-30 h-full hover:bg-red-400 transition-colors cursor-pointer"
    >
      Report
    </button>
  </div>
</template>
