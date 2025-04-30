<script setup>
definePageMeta({
  layout: "settings",
});
const tabs = reactive({
  profile: "profile",
  passwordSecurity: "passwordSecurity",
  personalDetails: "personalDetails",
  notifications: "notifications",
});
const selectedTab = ref(tabs.profile);
</script>

<template>
  <div
    class="flex flex-col gap-8 w-full max-w-5xl mx-auto mt-12 px-4"
    v-if="selectedTab"
  >
    <!-- Tabs -->
    <ul
      class="flex flex-col md:flex-row items-center flex-wrap justify-center gap-9 text-[20px]"
    >
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
        <NuxtLink
          to="/profile/settings/passwordsecurity"
          @click="selectedTab = tabs.passwordSecurity"
          :class="[
            'px-5 py-2 rounded-full font-semibold transition',
            selectedTab === tabs.passwordSecurity
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-amber-400/20',
          ]"
        >
          Password & Security
        </NuxtLink>
      </li>
      <li>
        <a
          @click="selectedTab = tabs.personalDetails"
          :class="[
            'px-5 py-2 rounded-full font-semibold transition cursor-pointer',
            selectedTab === tabs.personalDetails
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-amber-400/20',
          ]"
        >
          Personal Details
        </a>
      </li>
      <li>
        <a
          @click="selectedTab = tabs.notifications"
          :class="[
            'px-5 py-2 rounded-full font-semibold transition cursor-pointer',
            selectedTab === tabs.notifications
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-amber-400/20',
          ]"
        >
          Notifications
        </a>
      </li>
    </ul>

    <!-- Content -->
    <NuxtPage />
  </div>
</template>
