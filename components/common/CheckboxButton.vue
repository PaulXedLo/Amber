<script setup lang="ts">
const { changeSettings } = useSettings();
const props = defineProps<{
  type: string;
}>();
const {
  likesNotifications,
  commentsNotifications,
  followNotifications,
  showAge,
} = useSettings();
const buttonType = computed(() => {
  if (props.type === "likes") {
    return likesNotifications.value;
  } else if (props.type === "comments") {
    return commentsNotifications.value;
  } else if (props.type === "follows") {
    return followNotifications.value;
  } else if (props.type === "showAge") {
    return showAge.value;
  }
});
</script>
<template>
  <div class="mt-6">
    <label class="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="sr-only peer"
        :checked="buttonType"
        @change="async () => await changeSettings(props.type)"
      />
      <div
        class="relative w-20 h-10 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1.5 after:start-[12px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500 dark:peer-checked:bg-amber-500"
      ></div>
    </label>
  </div>
</template>
