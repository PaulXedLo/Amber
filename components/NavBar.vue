<script setup>
const user = useUserStore();
const { profilePic: profilePicture } = storeToRefs(user);
async function signOutUser() {
  await user.signOut();
}
</script>

<template>
  <header
    class="sticky top-0 z-50 h-16 w-full px-6 bg-gradient-to-b from-slate-900/90 to-slate-900/70 backdrop-blur-md border-b border-amber-500/20 shadow-md shadow-amber-500/5"
  >
    <nav class="max-w-7xl mx-auto flex items-center justify-between h-full">
      <span> </span>

      <div class="flex items-center gap-4">
        <div class="hidden md:flex">
          <input
            type="text"
            placeholder="Search"
            class="w-64 px-4 py-1.5 rounded-full bg-slate-800/60 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
        </div>

        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-amber-400 transition"
          >
            <div class="w-10 rounded-full">
              <NuxtImg alt="Profile image" :src="profilePicture" />
            </div>
          </div>
          <ul
            class="menu menu-sm dropdown-content right-0 mt-3 p-3 w-52 bg-slate-800/90 backdrop-blur border border-slate-700 text-white rounded-xl shadow-lg z-50"
          >
            <li>
              <NuxtLink
                :to="`/profile/me`"
                class="flex justify-between items-center hover:bg-slate-700 hover:text-amber-300 transition rounded-md px-3 py-2"
              >
                Profile
                <span v-if="user.isNewUser" class="badge badge-sm badge-warning"
                  >New</span
                >
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/profile/settings/profilesettings"
                class="block hover:bg-slate-700 hover:text-amber-300 transition rounded-md px-3 py-2"
              >
                Settings
              </NuxtLink>
            </li>
            <li @click="signOutUser">
              <a
                class="block hover:bg-slate-700 hover:text-amber-300 transition rounded-md px-3 py-2 cursor-pointer"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
