<script setup lang="ts">
const { bio, bioValue, editingBio, saveBio } = useSettings();
const showEditBioTooltip = ref<boolean>(false);
</script>
<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold text-slate-300">Bio</h2>

      <div v-if="!editingBio" class="flex items-center gap-2">
        <CommonTooltip content="Edit your bio">
          <button
            @click="editingBio = !editingBio"
            class="cursor-pointer flex items-center gap-2 text-amber-400 hover:text-amber-300 transition"
          >
            <Icon size="22" name="pepicons-pencil:pen-circle" />
            Edit
          </button>
        </CommonTooltip>
      </div>

      <div v-else class="flex items-center gap-2">
        <button
          @click="editingBio = !editingBio"
          class="cursor-pointer flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold px-3 py-2 rounded-full transition"
        >
          Cancel
        </button>
        <button
          @click="saveBio"
          class="cursor-pointer flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full transition"
        >
          Save
        </button>
      </div>
    </div>

    <textarea
      v-model="bioValue"
      :disabled="!editingBio"
      :class="{ 'opacity-50 cursor-not-allowed': !editingBio }"
      class="w-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400 resize-none h-32 transition"
      placeholder="Tell us about yourself..."
    ></textarea>
  </div>
</template>
