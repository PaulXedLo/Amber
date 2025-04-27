import { defineStore } from "pinia";
import prisma from "~/server/utils/prisma";

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: null,
    fullName: null,
    isSignedIn: false,
    hydrated: false,
    isNewUser: false,
    profilePic: null,
    username: null,
    bio: null,
    followStatus: {},
  }),
  actions: {
    async fetchPublicProfile(username) {
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
          posts: true,
        },
      });

      if (!profile) {
        throw new Error("Could not load profile");
      }

      return profile;
    },

    async fetchFollowersAndFollowingCount(userId) {
      const followers = await prisma.follower.count({
        where: { followingId: userId },
      });

      const following = await prisma.follower.count({
        where: { followerId: userId },
      });

      return { followers, following };
    },

    async fetchUserProfile() {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const id = session?.user?.id;
      if (!id) return;
      this.userId = id;

      const fallbackImage =
        "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";

      const profile = await prisma.profile.findUnique({
        where: { id },
      });

      if (profile) {
        this.username = profile.username;
        this.fullName = profile.full_name;
        this.bio = profile.bio;
        this.profilePic = profile.profile_picture || fallbackImage;
      } else {
        this.username = null;
        this.profilePic = fallbackImage;
      }
    },

    async signUpUser(values) {
      const supabase = useNuxtApp().$supabase;
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

      if (signupError) {
        alert(signupError.message);
        return { success: false, signupError };
      }

      const user = signupData.user;

      const profileData = await prisma.profile.create({
        data: {
          id: user.id,
          username: values.username,
          full_name: values.name,
          email: values.email,
          age: values.age,
        },
      });

      this.isSignedIn = true;
      this.isNewUser = true;

      return { success: true, signupData, profileData };
    },

    async logInUser(values) {
      const supabase = useNuxtApp().$supabase;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        return { success: false, error };
      } else {
        this.isSignedIn = true;
        await this.fetchUserProfile();
        return { success: true };
      }
    },

    async followUser(targetUserId) {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: targetUserId,
        },
      });

      this.followStatus[targetUserId] = true;
    },

    async unfollowUser(targetUserId) {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      await prisma.follower.deleteMany({
        where: {
          followerId: userId,
          followingId: targetUserId,
        },
      });

      this.followStatus[targetUserId] = false;
    },

    async checkIfFollowing(targetUserId) {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        this.followStatus[targetUserId] = false;
        return;
      }

      const existingFollow = await prisma.follower.findFirst({
        where: {
          followerId: userId,
          followingId: targetUserId,
        },
      });

      this.followStatus[targetUserId] = !!existingFollow;
    },

    async checkAuth() {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      this.isSignedIn = !!session;
      this.hydrated = true;

      if (session) {
        await this.fetchUserProfile();
      }
    },

    async signOut() {
      const supabase = useNuxtApp().$supabase;
      await supabase.auth.signOut();
      this.isSignedIn = false;
      this.isNewUser = false;
      this.profilePic = null;
      this.username = null;
      this.hydrated = false;
      navigateTo("/auth");
    },

    async changeProfilePicture(file) {
      const supabase = useNuxtApp().$supabase;
      if (!file) throw new Error("No file selected.");

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      await prisma.profile.update({
        where: { id: userId },
        data: {
          profile_picture: urlData.publicUrl,
        },
      });

      await this.fetchUserProfile();
    },

    async updateUsername(value) {
      if (!value) throw new Error("No value for updating username");
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const id = session?.user?.id;
      try {
        await prisma.profile.update({
          where: { id },
          data: { full_name: value },
        });
        await this.fetchUserProfile();
      } catch (error) {
        console.log(error);
      }
    },

    async updateBio(value) {
      if (!value) throw new Error("No value provided");
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const id = session?.user?.id;
      try {
        await prisma.profile.update({
          where: { id },
          data: { bio: value },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
