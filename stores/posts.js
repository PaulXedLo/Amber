import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    userPosts: [],
    allPosts: [],
  }),
  actions: {
    async toggleLikePost(postId) {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("*")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();

      const post = this.allPosts.find((p) => p.id === postId);
      if (!post) return;

      if (existingLike) {
        await supabase.from("post_likes").delete().eq("id", existingLike.id);
        post.likes_count = Math.max((post.likes_count || 1) - 1, 0);
        post.liked_by_me = false;
      } else {
        await supabase.from("post_likes").insert({
          user_id: userId,
          post_id: postId,
        });
        post.likes_count = (post.likes_count || 0) + 1;
        post.liked_by_me = true;
      }
    },
    async fetchPosts() {
      const supabase = useNuxtApp().$supabase;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Fetch user's own posts
      const { data: userPosts, error: userPostsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (userPostsError) {
        console.error("Fetch user posts error:", userPostsError.message);
      } else {
        this.userPosts = userPosts || [];
      }

      // Fetch all posts for everyone
      const { data: allPosts, error: allPostsError } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:profiles (
            id,
            username,
            full_name,
            profile_picture
          )
        `
        )
        .order("created_at", { ascending: false });

      if (allPostsError) {
        console.error("Fetch all posts error:", allPostsError.message);
      } else {
        this.allPosts = allPosts || [];
      }
    },

    async addPost(values) {
      const supabase = useNuxtApp().$supabase;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      let uploadedImageUrl = null;

      if (values.contentImage) {
        const file = values.contentImage;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload Error:", uploadError.message);
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("posts")
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      try {
        await supabase.from("posts").insert({
          user_id: userId,
          content_text: values.content,
          content_image: uploadedImageUrl,
          feeling: values.postFeeling,
        });
      } catch (error) {
        console.error("Insert post error:", error.message);
      }
    },
  },
});
