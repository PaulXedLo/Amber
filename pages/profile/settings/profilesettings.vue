<script setup>
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div
    class="w-full overflow-y-hidden max-w-4xl mx-auto px-6 flex flex-col gap-12 mt-10 animate__animated animate__fadeInUp animate__faster"
  >
    <!-- Profile Picture and Name section -->
    <div class="flex flex-col items-center gap-4">
    <SettingsProfilePicture />
    <SettingsNameEdit />
    </div>

    <!-- Bio Section -->
    <SettingsEditBio />

    <!--FOOTER-->
    <p class="text-center mt-3 text-[12px] text-gray-400">
      @AMBER PROJECT - 2025 Paul. All copyright rights reserved.
    </p>
  </div>
</template>
