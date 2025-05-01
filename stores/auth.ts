import { defineStore } from "pinia";
import type { UserProfile } from "~/types/auth";

export const useUserStore = defineStore("auth", {
  state: (): UserProfile => ({
    userId: null,
    fullName: null,
    isSignedIn: false,
    hydrated: false,
    isNewUser: false,
    profilePic: null,
    isPrivate: false,
    username: null,
    followersCount: null,
    followingCount: null,
    postsCount: null,
    bio: null,
    followStatus: {},
  }),
  actions: {
    async fetchUserProfile() {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        console.warn("User ID not found, cannot fetch profile.");
        return;
      }
      const fallbackImage =
        "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";

      try {
        const profileData = await $fetch(`/api/profile/me`, {
          query: { userId },
        });
        const { profiles, followersCount, followingCount, postsCount } =
          profileData;
        this.userId = profiles.id;
        this.fullName = profiles.fullName;
        this.profilePic = profiles.profilePicture || fallbackImage;
        this.username = profiles.username;
        this.bio = profiles.bio;
        this.isPrivate = profiles.isPrivate;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.postsCount = postsCount;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);

        this.userId = null;
        this.fullName = null;
        this.profilePic = fallbackImage;
        this.username = null;
        this.bio = null;
        this.isPrivate = false;
        this.followersCount = null;
        this.followingCount = null;
        this.postsCount = null;
      }
    },
    async updateProfile(
      values: Partial<UserProfile & { profilePicture?: File }>
    ) {
      const supabase = useNuxtApp().$supabase;

      console.warn("updateProfile called in auth.ts, ensure this is intended.");
    },
  },
});
