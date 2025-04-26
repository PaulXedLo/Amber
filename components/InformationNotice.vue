<script setup>
import "animate.css";
const infoBox = ref(null);
const emit = defineEmits(["closeInfo"]);

function closeInfo() {
  if (infoBox.value) {
    infoBox.value.classList.remove("animate__zoomIn");
    infoBox.value.classList.add("animate__zoomOut");
    setTimeout(() => {
      emit("closeInfo");
    }, 500);
  } else {
    emit("closeInfo");
  }
}
</script>

<template>
  <div class="mb-3 flex justify-center">
    <div
      role="alert"
      ref="infoBox"
      class="animate__animated animate__zoomIn font-bold alert alert-info mt-5 flex items-center justify-center m-auto w-70"
    >
      <Icon name="emojione-v1:warning" size="24" />
      <span class="text-xs text-black-50"><slot></slot></span>
      <a href="#" @click.prevent="closeInfo" class="hover:text-amber-100">✖</a>
    </div>
  </div>
</template>
