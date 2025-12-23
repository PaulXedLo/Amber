<script setup>
defineProps(["customClass"]);
const { searchQuery, searchUsers, clearSearch, searchInputRef, closeSearch } =
  useSearch();
</script>
<template>
  <div :class="['relative w-full', customClass]">
    <form @submit.prevent="searchUsers">
      <input
        type="text"
        placeholder="Search Amber..."
        ref="searchInputRef"
        v-model="searchQuery"
        @keydown.esc="closeSearch"
        class="w-full h-10 pl-10 pr-12 py-2 rounded-full bg-slate-700/70 text-slate-100 border border-slate-600 focus:ring-1 focus:ring-amber-500 outline-none placeholder-slate-400 text-sm transition-all"
      />
    </form>
    <Icon
      name="mdi:magnify"
      size="20"
      class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
    >
      <Icon name="mdi:close" size="18" />
    </button>
  </div>
</template>
