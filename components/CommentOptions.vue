<script setup>
const user = useUserStore();
const { userId } = toRefs(user);
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  showCommentOptions: {
    type: Boolean,
  },
  showPostOptions: {
    type: Boolean,
  },
});

const emit = defineEmits(["deleteComment", "reportComment"]);
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
    class="class animate__animated items-center w-auto animate__fadeIn overflow-hidden absolute z-50 flex right-12 bottom-0 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg text-sm"
    :class="{ hidden: !showPostOptions }"
  >
    <button
      type="button"
      class="animate__animated animate__slideInRight animate__faster p-2 w-auto h-full hover:bg-red-400 transition-colors cursor-pointer"
    >
      Delete
    </button>
    <button
      type="button"
      class="animate__animated animate__slideInRight animate__faster p-2 w-auto h-full hover:bg-red-400 transition-colors cursor-pointer"
    >
      Report
    </button>
  </div>
</template>
