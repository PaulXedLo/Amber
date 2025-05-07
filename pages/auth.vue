<script setup>
import "animate.css";
import authBackground from "/public/videos/authBackground.mp4";
definePageMeta({
  layout: "authpage",
});
const user = useUserStore();
const loading = ref(true);
const amberTitle = ref(null);
const animationStep = ref("zoomIn");
const titleAnimation = computed(() => {
  let currentAnimation = "";
  if (animationStep.value == "zoomIn") {
    currentAnimation = "animate__zoomInDown";
  } else if (animationStep.value == "flash") {
    currentAnimation = "animate__flash animate__infinite";
  } else if (animationStep.value == "pulse") {
    currentAnimation = "animate__pulse";
  }
  return currentAnimation;
});
function changeTitleAnimation() {
  setTimeout(() => (animationStep.value = "flash"), 1500);
  setTimeout(() => (animationStep.value = "pulse"), 3500);
}
onMounted(() => {
  if (!user.isSignedIn) {
    changeTitleAnimation();
    setInterval(() => {
      animationStep.value = "";
      changeTitleAnimation();
    }, 6000);
  }
});
onBeforeMount(async () => {
  await user.checkAuth();
  if (user.isSignedIn) {
    navigateTo("/home");
  } else {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="!loading">
    <div class="flex flex-col items-center justify-center">
      <video
        autoplay
        muted
        loop
        playsinline
        class="opacity-30 background-video"
      >
        <source :src="authBackground" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        class="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-amber-900/30 to-transparent backdrop-blur-sm z-0"
      ></div>
      <h1
        ref="amberTitle"
        :class="['text-white', 'animate__animated', titleAnimation]"
        class="font-extrabold cursor-pointer drop-shadow-xl mb-6 text-5xl sm:text-7xl md:text-8xl transition-all"
      >
        <Icon size="32" name="noto-v1:large-orange-diamond" />Amber<Icon
          size="32"
          name="noto-v1:large-orange-diamond"
        />
      </h1>
      <AuthFormAuth />
    </div>
  </div>
</template>
<style scoped>
.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
</style>
