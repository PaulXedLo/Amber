<script setup>
const user = useUserStore();
import { motion } from "motion-v";
const showSearchBar = ref(false);
const searchQuery = ref("");
const sidebarRef = ref(null);
const searchInputRef = ref(null);
const showMobileMenu = ref(false);
async function signOut() {
  await user.signOut();
}

function openSearch() {
  showSearchBar.value = true;
  nextTick(() => {
    searchInputRef.value?.focus();
  });
}

function closeSearch() {
  showSearchBar.value = false;
  searchQuery.value = "";
}

function clearSearch() {
  searchQuery.value = "";
  searchInputRef.value?.focus();
}
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
  if (showMobileMenu.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}
function handleClickOutside(event) {
  if (
    sidebarRef.value &&
    !sidebarRef.value.$el.contains(event.target) &&
    showMobileMenu.value
  ) {
    const menuButton = document.querySelector('button[aria-label="Open menu"]');
    if (menuButton && menuButton.contains(event.target)) {
      return;
    }
    toggleMobileMenu();
  }
}

watch(showMobileMenu, (newValue) => {
  if (newValue) document.addEventListener("mousedown", handleClickOutside);
  else document.removeEventListener("mousedown", handleClickOutside);
});
</script>
<template>
  <!-- Overlay for lower opacity of outer content when the mobile menu is open -->
  <div
    v-if="showMobileMenu"
    class="fixed inset-0 bg-black/50 z-30 md:hidden"
    @click="toggleMobileMenu"
  ></div>

  <!-- Mobile Header -->
  <div
    class="border-b-0 md:border-b fixed min-w-screen top-0 z-50 h-16 px-4 flex items-center justify-between md:hidden bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
  >
    <!-- Menu Icon -->
    <button
      @click="toggleMobileMenu"
      class="p-1 mt-1 text-slate-200 hover:text-amber-400 rounded-full focus:outline-none"
      aria-label="Open menu"
    >
      <motion.div :whileHover="{ scale: 1.1 }">
        <Icon name="mdi:menu" size="28" />
      </motion.div>
    </button>
    <!-- Search functionality & Profile -->
    <div class="flex items-center gap-2 flex-1 justify-end">
      <!-- Search Input  -->
      <div class="flex-1 flex justify-end min-w-0">
        <transition
          enter-active-class="transition-all duration-300 ease-in-out"
          leave-active-class="transition-all duration-200 ease-in-out"
          enter-from-class="opacity-0 max-w-0"
          enter-to-class="opacity-100 max-w-full"
          leave-from-class="opacity-100 max-w-full"
          leave-to-class="opacity-0 max-w-0"
        >
          <div v-if="showSearchBar" class="w-full relative">
            <input
              type="text"
              placeholder="Search Amber..."
              ref="searchInputRef"
              v-model="searchQuery"
              @keydown.esc="closeSearch"
              class="w-full h-10 pl-10 pr-12 py-2 rounded-full bg-slate-700/70 text-slate-100 border border-slate-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder-slate-400 text-sm"
            />
            <Icon
              name="mdi:magnify"
              size="20"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white rounded-full"
              aria-label="Clear search"
            >
              <Icon name="mdi:close-circle" size="18" />
            </button>
            <button
              @click="closeSearch"
              class="absolute right-1.5 top-6 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white rounded-full"
              aria-label="Close search"
            >
              <Icon name="mdi:close" size="22" />
            </button>
          </div>
        </transition>
      </div>

      <!-- Search Icon (toggle) -->
      <button
        v-if="!showSearchBar"
        @click="openSearch"
        class="p-1 text-slate-200 mt-1 hover:text-amber-400 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Open search"
      >
        <Icon name="mdi:magnify" size="28" />
      </button>

      <!-- Profile Pic -->
      <div
        class="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0"
      >
        <NuxtImg
          :src="user.profilePic"
          @click="$router.push('/profile/me')"
          alt="Profile"
          class="w-full h-full object-cover cursor-pointer"
        />
      </div>
    </div>
  </div>

  <!-- Desktop Sidebar -->
  <motion.aside
    ref="sidebarRef"
    :initial="{ x: '-100%' }"
    :animate="{ x: showMobileMenu ? '0%' : '-100%' }"
    :transition="{ duration: 0.3, ease: 'easeInOut' }"
    :class="[
      'h-screen w-64 flex flex-col justify-between px-6 py-8 bg-slate-900/80 border-r border-amber-500/10 backdrop-blur-md',
      'fixed top-0 left-0 z-40',
      'md:sticky md:!transform-none md:left-auto md:top-0 md:z-auto',
    ]"
  >
    <!-- Top: Logo and Navigation links -->
    <div class="flex flex-col gap-3 overflow-y-auto text-center">
      <NuxtLink
        to="/home"
        class="hidden md:block text-3xl font-extrabold text-amber-600 tracking-wide hover:text-amber-300 transition"
      >
        🔸 Amber 🔸
      </NuxtLink>

      <nav
        class="flex flex-col gap-4 md:ml-4 mt-14 md:mt-10 text-slate-200 overflow-y-hidden"
      >
        <NuxtLink
          to="/profile/me"
          class="hidden p-2 md:flex items-center gap-3 hover:text-amber-400 transition"
        >
          <motion.div
            class="flex items-center gap-3"
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.9 }"
          >
            <NuxtImg
              :src="user.profilePic"
              class="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400"
            />
            My Profile
          </motion.div>
        </NuxtLink>
        <NuxtLink
          to="/home"
          class="flex items-center p-2 gap-3 hover:text-amber-400 transition"
        >
          <motion.div
            class="flex items-center gap-3"
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.9 }"
          >
            <Icon name="mdi:home-outline" size="35" /> Home
          </motion.div>
        </NuxtLink>
        <NuxtLink
          to="/profile/settings/profilesettings"
          class="flex p-2 items-center gap-3 hover:text-amber-400 transition"
        >
          <motion.div
            class="flex items-center gap-3"
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.9 }"
          >
            <Icon name="mdi:notifications" size="35" /> Notifications
          </motion.div>
        </NuxtLink>
        <NuxtLink
          to="/uploadpost"
          class="flex p-2 items-center gap-3 hover:text-amber-400 transition"
        >
          <motion.div
            class="flex items-center gap-3"
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.9 }"
          >
            <Icon name="mdi:upload-outline" size="35" /> Upload post
          </motion.div>
        </NuxtLink>
        <NuxtLink
          to="/explore"
          class="flex p-2 items-center gap-3 hover:text-amber-400 transition"
        >
          <motion.div
            class="flex items-center gap-3"
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.9 }"
          >
            <Icon name="mdi:compass-outline" size="35" /> Explore
          </motion.div>
        </NuxtLink>

        <NuxtLink
          to="/profile/settings/profilesettings"
          class="flex p-2 items-center gap-3 hover:text-amber-400 transition"
        >
          <motion.div
            class="flex items-center gap-3"
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.9 }"
          >
            <Icon name="mdi:cog-outline" size="35" /> Settings
          </motion.div>
        </NuxtLink>
      </nav>
    </div>

    <!-- Bottom: Logout -->
    <div class="text-slate-400 md:ml-4 mt-8">
      <motion.button
        :whileHover="{ scale: 1.1 }"
        :whilePress="{ scale: 0.9 }"
        @click="signOut"
        class="cursor-pointer p-2 hidden md:flex items-center gap-3 hover:text-red-400 transition"
      >
        <Icon name="mdi:logout" size="40" /> Logout
      </motion.button>
    </div>
  </motion.aside>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #fbbf24;
  border-radius: 8px;
}
</style>
