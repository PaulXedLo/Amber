<script setup>
import "animate.css";
const authUserSelection = ref("Login");
const animationStep = ref("fadeUp");
const currentAnimation = computed(() => {
  let animationClass = "";
  if (animationStep.value == "fadeUp") {
    return (animationClass = "animate__fadeInUp");
  } else if (animationStep.value == "fadeDown") {
    return (animationClass = "animate__fadeOutDown");
  }
  return animationClass;
});
function switchTab() {
  animationStep.value = "fadeDown";
  setTimeout(() => {
    if (authUserSelection.value == "Login") {
      authUserSelection.value = "Register";
    } else {
      authUserSelection.value = "Login";
    }
    animationStep.value = "fadeUp";
  }, 500);
}
</script>

<template>
  <div
    class="animate__animated animate__fadeInUp animate__faster"
    :class="currentAnimation"
  >
    <AuthLoginForm
      v-if="authUserSelection == 'Login'"
      @switch-tab="switchTab"
    />
    <AuthRegisterForm v-else @switch-tab="switchTab" />
  </div>
</template>
