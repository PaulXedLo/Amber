import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    userPosts: [],
  }),
  actions: {
    async fetchPosts() {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const id = session?.user?.id;
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Fetch posts error:", error.message);
        return;
      }
      this.userPosts = posts || [];
    },

    async addPost(values) {
      const supabase = useNuxtApp().$supabase;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session?.user?.id;
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
