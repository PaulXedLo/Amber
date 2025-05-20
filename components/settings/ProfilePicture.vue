<script setup lang="ts">
const {selectedFile, isUploading, handleNewPicture, handlePictureChange, triggerFileInput, fileInput, previewUrl} = useSettings();
</script>
<template>
      <div
        class="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg cursor-pointer"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleNewPicture"
        />
        <MyprofilePicture
          :src="previewUrl || ''"
          :isClickable="true"
          :altText="'User profile picture'"
          :sizeClasses="'w-full h-full'"
          :containerClasses="'group-hover:opacity-60 transition'"
        />
        <div
          class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition"
        >
          Edit
        </div>

        <!-- Loader on Upload -->
        <div
          v-if="isUploading"
          class="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold animate-pulse"
        >
          Uploading...
        </div>
      </div>

      <!-- Confirm Button -->
      <div v-if="selectedFile && !isUploading" class="mt-2">
        <button
          @click.prevent="handlePictureChange"
          class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full shadow-md transition"
        >
          Confirm New Picture
        </button>
      </div>
</template>