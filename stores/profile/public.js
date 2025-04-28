import { defineStore } from "pinia";
export const usePublicStore = defineStore("public", {
  state: () => ({
    userId: null,
    fullName: null,
    isNewUser: false,
    profilePic: null,
    username: null,
    bio: null,
    followStatus: {},
  }),
  actions: {
    async fetchPublicProfile(username) {
      try {
        const profileData = await $fetch(`/api/profile/${username}`);
        const profiles = profileData.profiles;
        this.userId = profiles.id;
        this.fullName = profiles.fullName;
        this.profilePic = profiles.profilePicture;
        this.username = profiles.username;
        this.bio = profiles.bio;
        return profileData;
      } catch (error) {
        console.log(error);
        throw new Error("Could not get user");
      }
    },
  },
});
