<script setup>
import "animate.css";
const user = useUserStore();
const props = defineProps({ post: Object });
</script>
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <!--MODAL CONTENT-->
    <div
      class="animate__animated animate__zoomIn animate__faster flex w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden bg-slate-900"
    >
      <!--LEFT SIDE (IMAGE)-->
      <div class="flex-1 bg-black flex items-center justify-center">
        <NuxtImg
          :src="post.posts.contentImage"
          alt="Post Image"
          class="object-cover w-full h-full"
        />
      </div>

      <!--RIGHT SIDE (POST INFO)-->
      <div class="w-[400px] flex flex-col p-6 gap-4 relative">
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-white text-1xl hover:text-amber-400"
        >
          <Icon
            name="noto:orange-circle"
            class="cursor-pointer hover:opacity-70"
          />
        </button>
        <!--PROFILE INFO-->
        <div class="flex items-center gap-3">
          <NuxtImg
            @click="$emit('close')"
            :src="post.profiles.profilePicture"
            class="cursor-pointer w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 class="text-white font-bold">
              {{ post.profiles.fullName }} -
              <span class="text-sm text-slate-400">{{
                post.posts.feeling
              }}</span>
            </h2>
            <p
              @click="$emit('close')"
              class="cursor-pointer text-sm text-slate-400"
            >
              @{{ post.profiles.username }}
            </p>
          </div>
        </div>
        <!--Post description-->
        <p class="text-slate-300">{{ post.posts.contentText }}</p>

        <!--LIKES -->

        <div
          class="flex flex-row justify-between items-center gap-2 text-center"
        >
          <div class="flex flex-row items-center gap-1">
            <Icon
              name="system-uicons:heart"
              size="35"
              class="mt-2 cursor-pointer"
            />
            <p class="mt-2 text-xl">{{ post.posts.likesCount }}</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Add a new comment..."
              class="border-b-amber-400 border-b h-10 mr-4 focus:outline-0"
            />
            <button
              type="button"
              class="cursor-pointer font-bold px-4 py-2 rounded-full bg-amber-500 text-white outline-0"
            >
              Add
            </button>
          </div>
        </div>

        <!--COMMENTS SECTION-->

        <div
          class="flex flex-col gap-4 overflow-y-auto max-h-[300px] p-2 rounded-lg bg-slate-800/50"
        >
          <div class="flex flex-row p-2 gap-5">
            <NuxtImg :src="user.profilePic" class="w-8 h-8 rounded-full" />
            <h3 class="text-[13px]">
              Hye there guys my name is paul im from the bronx type shi listen
              up
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
