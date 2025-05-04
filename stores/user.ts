import { defineStore } from "pinia";
import type { SignUpData, UserProfile } from "~/types/auth";

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
      if (!userId) {
        console.warn("User ID not found in fetchUserProfile.");

        this.userId = null;
        this.username = null;
        this.profilePic = null;
        this.isSignedIn = false;
        return;
      }
      const fallbackImage =
        "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";

      try {
        const profileData = await $fetch("/api/profile/me", {
          query: { userId: userId },
        });

        if (profileData || profileData.profiles) {
          const { profiles, followersCount, followingCount, postsCount } =
            profileData;
          this.userId = profiles.id;
          this.fullName = profiles.fullName;
          this.profilePic = profiles.profilePicture || fallbackImage;
          this.username = profiles.username;
          this.bio = profiles.bio;
          this.isPrivate = profiles.isPrivate ?? false;
          this.followingCount = followingCount;
          this.followersCount = followersCount;
          this.postsCount = postsCount;
        } else {
          console.error(
            "Received invalid profile data structure:",
            profileData
          );
          this.userId = null;
          this.username = null;
          this.profilePic = fallbackImage;
        }
      } catch (error) {
        console.error(
          "Failed to fetch user profile from /api/profile/me.Full error:",
          error
        );
        alert(
          "Could not load your profile information. Please try again later."
        );
        this.userId = null;
        this.username = null;
        this.profilePic = fallbackImage;
        this.isSignedIn = false;
      }
    },
    async signUpUser(values: SignUpData) {
      const supabase = useNuxtApp().$supabase;

      if (
        !values.email ||
        !values.password ||
        !values.username ||
        !values.name ||
        !values.age
      ) {
        alert("Please fill in all required fields.");
        return { success: false, error: new Error("Missing required fields") };
      }
      try {
        const { data: signupData, error: signupError } =
          await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });
        if (signupError) {
          console.error("Signup Error:", signupError.message);
          alert(signupError.message);
          return { success: false, error: signupError };
        }

        const user = signupData.user;
        if (!user) {
          console.error("Signup succeeded but no user object returned.");
          alert("Signup failed: No user data received.");
          return {
            success: false,
            error: new Error("No user data received after signup"),
          };
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: values.username,
            full_name: values.name,
            email: values.email,
            age: values.age,
          })
          .select()
          .single();

        if (profileError) {
          console.error("Profile Creation Error:", profileError.message);

          alert(profileError.message);
          return { success: false, error: profileError };
        }

        this.isSignedIn = true;
        this.isNewUser = true;

        await this.fetchUserProfile();
        return { success: true, data: { signupData, profileData } };
      } catch (error) {
        console.error("Unexpected SignUp Error:", error);
        alert("An unexpected error occurred during sign up.");
        return { success: false, error };
      }
    },
    async logInUser(values: any) {
      const supabase = useNuxtApp().$supabase;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) {
          console.error("Login Error:", error.message);

          alert(error.message);
          return { success: false, error };
        }

        if (data && data.session) {
          this.isSignedIn = true;
          this.isNewUser = false;
          await this.fetchUserProfile();
          return { success: true };
        } else {
          console.error("Login successful but no session data received.");
          alert("Login failed: Could not retrieve session.");
          return {
            success: false,
            error: new Error("No session data received"),
          };
        }
      } catch (error) {
        console.error("Unexpected Login Error:", error);
        alert("An unexpected error occurred during login.");
        return { success: false, error };
      }
    },
    async updateUserPassword(values: any) {
      const supabase = useNuxtApp().$supabase;
      try {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });
        if (error) {
          console.error("Could not update password", error);
          alert("Failed to update password: " + error.message);
        } else {
          alert("Password updated successfully.");
        }
      } catch (error) {
        console.error("Unexpected error updating password:", error);
        alert("An unexpected error occurred while updating the password.");
      }
    },
    async checkAuth() {
      const supabase = useNuxtApp().$supabase;
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (error) {
          console.error("Error checking auth session:", error.message);
          this.isSignedIn = false;
        } else {
          this.isSignedIn = !!session;
          this.fetchUserProfile();
          if (session) {
            if (!userId) {
              console.warn(
                "checkAuth: fetchUserProfile failed after confirming session. Setting isSignedIn to false."
              );
              this.isSignedIn = false;
            }
          } else {
            this.userId = null;
            this.fullName = null;
            this.profilePic = null;
            this.username = null;
            this.bio = null;
            this.isPrivate = false;
            this.followersCount = null;
            this.followingCount = null;
            this.postsCount = null;
            this.followStatus = {};
          }
        }
      } catch (error) {
        console.error("Unexpected error during checkAuth. Full error:", error);
        alert(
          "There was a problem checking your session. Please try refreshing the page."
        );
        this.isSignedIn = false;
      } finally {
        this.hydrated = true;
      }
    },
    async signOut() {
      const supabase = useNuxtApp().$supabase;
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Error signing out:", error.message);
        }
      } catch (error) {
        console.error("Unexpected error during sign out:", error);
      } finally {
        this.isSignedIn = false;
        this.isNewUser = false;
        this.profilePic = null;
        this.username = null;
        this.userId = null;
        this.fullName = null;
        this.bio = null;
        this.isPrivate = false;
        this.followersCount = null;
        this.followingCount = null;
        this.postsCount = null;
        this.followStatus = {};
        this.hydrated = true;

        await navigateTo("/auth");
      }
    },
    async updateProfile(
      values: Partial<UserProfile & { profilePicture?: File }>
    ) {
      const supabase = useNuxtApp().$supabase;
      if (!this.userId) {
        console.error("Cannot update profile: User ID is missing.");
        throw new Error("User not authenticated.");
      }

      let updatePayload: Partial<any> = {};
      let pictureChanged = false;

      if (values.profilePicture instanceof File) {
        pictureChanged = true;
        const file = values.profilePicture;
        const fileExt = file.name.split(".").pop();
        const fileName = `${this.userId}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) {
            console.error("Upload Error:", uploadError.message);
            throw new Error("Failed to upload profile picture.");
          }
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

          if (urlData && urlData.publicUrl) {
            updatePayload.profilePicture = urlData.publicUrl;
          } else {
            console.error("Failed to get public URL for uploaded avatar.");

            throw new Error("Failed to get public URL for profile picture.");
          }
        } catch (error) {
          console.error("Error handling profile picture upload:", error);
          throw error;
        }
      }

      if (values.bio !== undefined) updatePayload.bio = values.bio;
      if (values.fullName !== undefined)
        updatePayload.fullName = values.fullName;

      if (values.hasOwnProperty("isPrivate"))
        updatePayload.isPrivate = values.isPrivate;

      if (Object.keys(updatePayload).length === 0) {
        console.log("No profile data provided for update.");

        if (!pictureChanged) return;
      }

      try {
        await $fetch("/api/profile/update", {
          method: "PATCH",
          query: { userId: this.userId },
          body: updatePayload,
        });

        await this.fetchUserProfile();
      } catch (error) {
        console.error("Could not update profile data in DB", error);

        throw new Error("Failed to update profile.");
      }
    },
  },
});
