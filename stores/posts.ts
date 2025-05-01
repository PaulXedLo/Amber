import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    userPosts: [],
    allPosts: [],
  }),
  actions: {
    async fetchPosts() {
      const supabase = useNuxtApp().$supabase;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      const { userPosts, allPosts }: any = await $fetch("/api/posts", {
        query: { userId },
        method: "GET",
      });
      this.userPosts = userPosts;
      this.allPosts = allPosts;
    },
    async addPost(values: any) {
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
        await $fetch("/api/posts", {
          method: "POST",
          body: {
            userId,
            contentImage: uploadedImageUrl,
            contentText: values.content,
            feeling: values.postFeeling,
          },
        });
        await this.fetchPosts();
      } catch (error) {
        console.log("Error! couldnt add post", error);
      }
    },
    async fetchComments(postId: any) {
      if (!postId) return;
      try {
        const allComments = await $fetch("/api/posts/comment", {
          method: "GET",
          query: { postId },
        });
        return allComments;
      } catch (error) {
        console.log("Could not fetch comments", error);
        throw new Error("Cannot get comments");
      }
    },
  },
});
