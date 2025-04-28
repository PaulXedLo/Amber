import { defineStore } from "pinia";
export const usePublicStore = defineStore("public", {
  state: () => ({
    userId: null,
    fullName: null,
    isNewUser: false,
    postsCount: null,
    followingCount: null,
    followersCount: null,
    profilePic: null,
    username: null,
    bio: null,
    followStatus: {},
  }),
  actions: {
    async fetchPublicProfile(username) {
      const fallbackImage =
        "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
      try {
        const profileData = await $fetch(`/api/profile/${username}`);
        const { profiles, followersCount, followingCount, postsCount } =
          profileData;
        this.userId = profiles.id;
        this.fullName = profiles.fullName;
        this.profilePic = profiles.profilePicture || fallbackImage;
        this.username = profiles.username;
        this.bio = profiles.bio;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.postsCount = postsCount;
        return profileData;
      } catch (error) {
        console.log(error);
        throw new Error("Could not get user");
      }
    },
  },
});
