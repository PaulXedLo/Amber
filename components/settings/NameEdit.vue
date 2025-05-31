<script setup lang="ts">
const {
  usernameEdit,
  username,
  fullName,
  newUsernameValue,
  editingUsername,
  saveUsername,
  toggleEditingUsername,
} = useSettings();
</script>
<template>
  <div class="text-center mt-4">
    <div class="flex-col flex sm:flex-row gap-5 items-center">
      <h1 class="text-2xl font-extrabold" v-if="!editingUsername">
        {{ fullName }}
      </h1>
      <input
        type="text"
        v-model="newUsernameValue"
        class="text-center text-2xl font-bold outline-0"
        v-else
      />
      <div v-if="!editingUsername">
        <CommonTooltip content="Click to edit your username">
          <button
            @click="toggleEditingUsername"
            class="cursor-pointer flex items-center gap-2 text-amber-400 hover:text-amber-300 transition"
          >
            <Icon size="18" name="pepicons-pencil:pen-circle" />
            Edit
          </button>
        </CommonTooltip>
      </div>
      <div
        v-else="editingUsername"
        class="mb-5 sm:mb-0 flex items-center gap-2"
      >
        <button
          @click="saveUsername"
          class="cursor-pointer flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-3 py-2 rounded-full transition"
        >
          Save
        </button>
        <button
          @click="toggleEditingUsername"
          class="cursor-pointer flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold px-3 py-2 rounded-full transition"
        >
          Cancel
        </button>
      </div>
    </div>

    <p class="text-slate-400">@{{ username }}</p>
  </div>
</template>
