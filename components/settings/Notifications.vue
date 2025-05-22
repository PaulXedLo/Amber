<template>
  <div class="flex flex-col w-full min-h-100 text-slate-100">
    <div class="w-full max-w-3xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <h1
        class="text-4xl font-extrabold text-center mb-3 tracking-tight bg-clip-text text-slate-100"
      >
        Notifications
      </h1>
      <p class="text-center text-slate-400 text-lg">
        Tailor your alert preferences with ease.
      </p>
    </div>

    <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-8">
        <div
          class="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-2xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div class="p-3 flex rounded-full bg-pink-500/20 mb-4 text-pink-400">
            <Icon name="material-icon-theme:github-sponsors" size="30" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-100 mb-2">Likes</h2>
          <p class="text-slate-400 text-center text-sm mb-6 h-12">
            Get notified when someone appreciates your post.
          </p>
          <CommonCheckboxButton type="likes" />
        </div>

        <div
          class="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-2xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div class="p-3 rounded-full flex bg-sky-500/20 mb-4 text-sky-400">
            <Icon name="material-symbols:person-add-outline" size="30" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-100 mb-2">Follows</h2>
          <p class="text-slate-400 text-center text-sm mb-6 h-12">
            Stay updated on new followers and follow requests.
          </p>
          <CommonCheckboxButton type="follows" />
        </div>

        <div
          class="bg-slate-900/80 backdrop-blur-md rounded-xl shadow-2xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div
            class="p-3 rounded-full bg-emerald-500/20 mb-4 flex text-emerald-400"
          >
            <Icon name="material-symbols:comment-outline" size="30" />
          </div>
          <h2 class="text-2xl font-semibold text-slate-100 mb-2">Comments</h2>
          <p class="text-slate-400 text-center text-sm mb-6 h-12">
            Be alerted when someone comments on your content.
          </p>
          <CommonCheckboxButton type="comments" />
        </div>
      </div>
    </div>
    <p class="text-center text-slate-400 text-sm mt-8">
      &copy; {{ new Date().getFullYear() }} AMBER. All rights reserved.
    </p>
  </div>
</template>
