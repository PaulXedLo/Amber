import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    fullName: null,
    isSignedIn: false,
    hydrated: false,
    isNewUser: false,
    profilePic: null,
    username: null,
    bio: null,
  }),
  actions: {
    async fetchUserProfile() {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const id = session?.user?.id;
      if (!id) return;

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
        if (profile.profile_picture) {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(profile.profile_picture);
          this.profilePic = urlData?.publicUrl || fallbackImage;
        } else {
          this.profilePic = fallbackImage;
        }
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
      const filePath = `avatars/${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (error) {
        throw new Error(error.message);
      }
      // UPDATE PROFILE PICTURE PATH IN DATABASE
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      await supabase
        .from("profiles")
        .update({ profile_picture: filePath })
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
