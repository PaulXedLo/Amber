<script setup>
import "animate.css";
const user = useUserStore();
const toast = useToast();
let { isPrivate } = storeToRefs(user);
async function togglePrivacy() {
  try {
    await user.updateProfile({ isPrivate: !user.isPrivate });
    toast.success({
      message: "Account privacy updated successfully",
      timeout: 2000,
      position: "topCenter",
    });
    isPrivate.value = user.isPrivate;
  } catch (error) {
    console.error("Error updating privacy:", error);
    toast.error({
      message: "Failed to update account privacy",
      timeout: 2000,
      position: "topCenter",
    });
  }
}
</script>

<template>
  <div
    class="max-w-2xl mx-auto px-4 py-12 text-white animate__animated animate__fadeIn animate__faster"
  >
    <div class="flex flex-col items-center text-center">
      <h2 class="text-3xl font-bold mb-6">Account Privacy</h2>
      <p class="">Turn public account on or off</p>
      <div class="mt-6">
        <label class="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            class="sr-only peer"
            :checked="isPrivate"
            @change="togglePrivacy"
          />
          <div
            class="relative w-20 h-10 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1.5 after:start-[12px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500 dark:peer-checked:bg-amber-500"
          ></div>
        </label>
      </div>
      <p class="mt-3">
        Current Status:
        <strong class="underline">{{
          user.isPrivate ? "Private" : "Public"
        }}</strong>
      </p>
    </div>
  </div>
</template>
