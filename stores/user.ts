import { defineStore } from "pinia";
interface SignUpData {
  email: string;
  password: string;
  username: string;
  name: string;
  age: number;
}
interface UserProfile {
  userId: string | null;
  fullName: string | null;
  isSignedIn: boolean;
  hydrated: boolean;
  isNewUser: boolean;
  profilePic: string | null;
  isPrivate: boolean | null;
  username: string | null;
  followersCount: Object | null;
  followingCount: Object | null;
  postsCount: Object | null;
  bio: string | null;
  followStatus: Record<string, boolean | string>;
}
export const useUserStore = defineStore("user", {
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
        this.followingCount = followingCount;
        this.followersCount = followersCount;
        this.postsCount = postsCount;
        return profileData;
      } catch (error) {
        this.username = null;
        this.profilePic = fallbackImage;
        console.log("cannot fetch user profile", error);
      }
    },
    async signUpUser(values: SignUpData) {
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
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user?.id || "",
          username: values.username,
          full_name: values.name,
          email: values.email,
          age: values.age,
        });
      if (profileError) {
        alert(profileError.message);
        return { success: false, error: profileError };
      }
      this.isSignedIn = true;
      this.isNewUser = true;
      return { success: true, signupData, profileData };
    },
    async logInUser(values: any) {
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
    async updateUserPassword(values: any) {
      const supabase = useNuxtApp().$supabase;
      const { error } = await supabase.auth.updateUser({
        password: `${values.password}`,
      });
      if (error) {
        console.log("Could not update password", error);
      }
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
    async updateProfile(values: any) {
      const supabase = useNuxtApp().$supabase;
      // UPDATE PROFILE PICTURE
      if (values.profilePicture) {
        const fileExt = values.profilePicture.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, values.profilePicture, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        values.profilePicture = urlData.publicUrl;
        try {
          await $fetch("/api/profile/update", {
            body: values,
            query: { userId: this.userId },
            method: "PATCH",
          });
          await this.fetchUserProfile();
        } catch (error) {
          console.log("Could not upload profile picture", error);
        }
      }
      // UPDATE USER BIO
      if (values.bio) {
        try {
          await $fetch("/api/profile/update", {
            method: "PATCH",
            query: { userId: this.userId },
            body: values,
          });
          await this.fetchUserProfile();
        } catch (error) {
          console.log("Could not update profile bio", error);
          throw new Error("Failed to update bio");
        }
      }
      // UPDATE USER FULLNAME
      if (values.fullName) {
        try {
          await $fetch("/api/profile/update", {
            query: { userId: this.userId },
            method: "PATCH",
            body: values,
          });
        } catch (error) {
          console.log("Could not update full name", error);
          throw new Error("Failed to update name");
        }
      }
      // UPDATE USER PRIVACY
      if (values.hasOwnProperty("isPrivate")) {
        try {
          await $fetch("/api/profile/update", {
            query: { userId: this.userId },
            method: "PATCH",
            body: values,
          });
          await this.fetchUserProfile();
        } catch (error) {
          console.log("Could not update profile privacy", error);
          throw new Error("Failed to update privacy");
        }
      }
    },
  },
});
