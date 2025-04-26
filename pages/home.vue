<script setup>
const user = useUserStore();
const posts = usePostsStore();
const { data: randomUsers, pending } = useFetch("/api/random-users");

definePageMeta({ layout: "default" });

onMounted(async () => {
  await posts.fetchAllPosts();
});
</script>

<template>
  <div class="min-h-screen w-full px-4 pb-10">
    <!-- Page title -->
    <div class="text-center mt-12">
      <h1
        class="text-4xl sm:text-5xl font-extrabold text-amber-400 drop-shadow-lg tracking-wide"
      >
        Top posts for you
      </h1>
    </div>
    <!--UPLOAD NEW POST-->
    <CreatePost />
    <template v-if="pending">
      <div class="flex justify-center my-10">
        <span class="loading loading-spinner loading-xl"></span>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center gap-10 mt-8">
        <div
          v-for="user in randomUsers"
          :key="user.name"
          class="w-full max-w-2xl rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-lg hover:shadow-amber-500/20 transition duration-300 p-6"
        >
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full overflow-hidden">
                <img
                  :src="user.profilePicture"
                  alt="avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 class="text-white font-bold text-md leading-tight">
                  {{ user.name }}
                </h2>
                <p class="text-sm text-slate-400">{{ user.tag }}</p>
              </div>
            </div>
            <button
              class="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-sm text-white font-semibold shadow-sm hover:shadow-md transition"
            >
              Follow
            </button>
          </div>

          <!-- Content -->
          <p class="text-slate-300 mb-3">{{ user.description }}</p>
          <img
            :src="user.contentImage"
            class="rounded-lg w-full object-cover"
          />

          <!-- Likes -->
          <div class="flex items-center gap-2 mt-4">
            <button
              class="btn btn-circle hover:shadow-[0_0_10px_#fbbf24] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="size-[1.2em]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
            <span class="text-sm text-slate-300">{{ user.likes }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
