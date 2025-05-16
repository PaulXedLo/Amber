<script setup lang="ts">
const { activePost } = useModal();
defineProps<{
  fallbackImage: string;
}>();
</script>
<template>
  <div
    class="w-full h-[40vh] md:h-auto md:flex-1 flex items-center justify-center bg-black"
  >
    <NuxtImg
      :src="activePost?.posts.contentImage || fallbackImage"
      alt="Post Image"
      class="object-contain w-full h-full"
      sizes="(max-width: 767px) 90vw, (min-width: 768px) and (max-width: 1023px) 55vw, (min-width: 1024px) 600px"
      format="webp"
      quality="80"
      loading="lazy"
    />
  </div>
</template>
