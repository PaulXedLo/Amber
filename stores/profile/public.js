import { defineStore } from "pinia";
export const usePublicStore = defineStore("public", {
  state: () => ({
    userId: null,
    fullName: null,
    isNewUser: false,
    postsCount: 0,
    followingCount: 0,
    followersCount: 0,
    followNotifications: true,
    likesNotifications: true,
    commentsNotifications: true,
    age: null,
    showAge: false,
    profilePic: null,
    isPrivate: null,
    username: null,
    bio: null,
    isFollowing: null,
    followStatus: {},
  }),
  actions: {
    async fetchPublicProfile(username) {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const id = session?.user?.id;
      const fallbackImage =
        "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
      try {
        const profileData = await $fetch(`/api/profile/${username}`, {
          query: { userId: id },
        });
        const {
          profiles,
          posts,
          followersCount,
          notificationPreferences,
          isFollowing,
          followingCount,
          postsCount,
        } = profileData;
        this.userId = profiles.id;
        this.fullName = profiles.fullName;
        this.profilePic = profiles.profilePicture || fallbackImage;
        this.username = profiles.username;
        this.bio = profiles.bio;
        this.showAge = profiles.showAge ?? false;
        this.age = Number(profiles.age);
        this.isPrivate = profiles.isPrivate ?? false;
        this.likesNotifications = notificationPreferences.likes ?? true;
        this.commentsNotifications = notificationPreferences.comments ?? true;
        this.followNotifications = notificationPreferences.follows ?? true;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.isFollowing = isFollowing;
        this.postsCount = postsCount;
        return { profiles, posts };
      } catch (error) {
        console.log(error);
        throw new Error("Could not get user");
      }
    },
  },
});
