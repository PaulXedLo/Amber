<script setup lang="ts">
const fallbackImage =
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  navigateToPath: {
    type: String,
    default: "",
  },
  altText: {
    type: String,
    default: "Profile picture",
  },
  sizeClasses: {
    type: String,
    default: "w-12 h-12",
  },
  containerClasses: {
    type: String,
    default: "rounded-full overflow-hidden border-2 border-amber-400",
  },
  imageClasses: {
    type: String,
    default: "w-full h-full object-cover",
  },
  isClickable: {
    type: Boolean,
    default: true,
  },
});

const handleClick = () => {
  if (props.isClickable && props.navigateToPath) {
    navigateTo(props.navigateToPath);
  }
};

const combinedImageClasses = computed(() => {
  let classes = props.imageClasses;
  if (props.isClickable && props.navigateToPath) {
    classes += " cursor-pointer hover:opacity-40 transition-all duration-400";
  }
  return classes;
});
</script>

<template>
  <div :class="[props.sizeClasses, props.containerClasses]">
    <NuxtImg
      :src="props.src || fallbackImage"
      :alt="props.altText"
      @click="handleClick"
      densities="x1"
      :class="combinedImageClasses"
    />
  </div>
</template>
