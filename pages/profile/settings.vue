<script setup>
definePageMeta({
  layout: "settings",
});
const selectedTab = ref(null);
const tabs = reactive({
  profile: "profile",
  passwordSecurity: "passwordSecurity",
  personalDetails: "personalDetails",
  notifications: "notifications",
});
onMounted(() => {
  if (!selectedTab.value) {
    selectedTab.value = tabs.profile;
  }
});
</script>

<template>
  <div class="flex flex-col gap-8 w-full max-w-5xl mx-auto mt-12 px-4">
    <!-- Tabs -->
    <ul class="flex flex-wrap justify-center gap-4">
      <li>
        <NuxtLink
          to="/profile/settings/profilesettings"
          @click="selectedTab = tabs.profile"
          :class="[
            'px-5 py-2 rounded-full font-semibold transition',
            selectedTab === tabs.profile
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-amber-400/20',
          ]"
        >
          Profile
        </NuxtLink>
      </li>
      <li>
        <a
          @click="selectedTab = tabs.passwordSecurity"
          class="px-5 py-2 rounded-full font-semibold bg-slate-800/70 text-slate-300 hover:bg-amber-400/20 transition cursor-pointer"
        >
          Password & Security
        </a>
      </li>
      <li>
        <a
          @click="selectedTab = tabs.personalDetails"
          class="px-5 py-2 rounded-full font-semibold bg-slate-800/70 text-slate-300 hover:bg-amber-400/20 transition cursor-pointer"
        >
          Personal Details
        </a>
      </li>
      <li>
        <a
          @click="selectedTab = tabs.notifications"
          class="px-5 py-2 rounded-full font-semibold bg-slate-800/70 text-slate-300 hover:bg-amber-400/20 transition cursor-pointer"
        >
          Notifications
        </a>
      </li>
    </ul>

    <!-- Content -->
    <NuxtPage />
  </div>
</template>
