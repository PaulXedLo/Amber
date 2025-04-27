import { defineStore } from "pinia";

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
    async fetchPublicProfile(value) {
      const supabase = useNuxtApp().$supabase;
      const { data, error } = await supabase
        .from("profiles")
        .select("*,post:posts(*)")
        .eq("username", value)
        .single();
      if (error) {
        throw new Error("Could not load profile");
      }
      return data;
    },
    async fetchFollowersAndFollowingCount(userId) {
      const supabase = useNuxtApp().$supabase;
      const { count: followers } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);

      const { count: following } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);
      return { followers: followers || 0, following: following || 0 };
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

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
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
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

      await supabase
        .from("followers")
        .insert({ follower_id: userId, following_id: targetUserId });

      this.followStatus[targetUserId] = true;
    },
    async unfollowUser(targetUserId) {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", userId)
        .eq("following_id", targetUserId);

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

      const { data } = await supabase
        .from("followers")
        .select("*")
        .eq("follower_id", userId)
        .eq("following_id", targetUserId)
        .maybeSingle();

      this.followStatus[targetUserId] = !!data;
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
      await supabase
        .from("profiles")
        .update({ profile_picture: urlData.publicUrl })
        .eq("id", userId);

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
        await supabase
          .from("profiles")
          .update({ full_name: value })
          .eq("id", id);

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
        await supabase.from("profiles").update({ bio: value }).eq("id", id);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
