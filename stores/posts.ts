import { defineStore } from "pinia";
import type {
  PostWithProfile,
  CreatePostPayload,
  DeletePostPayload,
  Comment,
} from "~/types/post";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    userPosts: [] as PostWithProfile[],
    allPosts: [] as PostWithProfile[],
  }),

  actions: {
    // FETCH POSTS
    // This function fetches posts for the authenticated user
    // It first checks if the user is authenticated and retrieves their user ID
    // It then fetches the user's posts and all posts from the API
    // The fetched posts are stored in the userPosts and allPosts state variables
    async fetchPosts() {
      const supabase = useNuxtApp().$supabase;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      const { userPosts, allPosts } = await $fetch<{
        userPosts: PostWithProfile[];
        allPosts: PostWithProfile[];
      }>("/api/posts", {
        query: { userId },
        method: "GET",
      });

      this.userPosts = userPosts;
      this.allPosts = allPosts;
      console.log("User posts:", this.userPosts);
      console.log("All posts:", this.allPosts);
    },
    // ADD POST
    // This function adds a new post
    // It first checks if the user is authenticated and retrieves their user ID
    // It then uploads the image to Supabase storage if provided
    async addPost(values: {
      content: string;
      postFeeling?: string;
      contentImage?: File;
    }) {
      const supabase = useNuxtApp().$supabase;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      let uploadedImageUrl: string | null = null;

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

      const payload: CreatePostPayload = {
        userId,
        contentText: values.content,
        contentImage: uploadedImageUrl,
        feeling: values.postFeeling,
      };

      try {
        await $fetch("/api/posts", {
          method: "POST",
          body: payload,
        });
        await this.fetchPosts();
      } catch (error) {
        console.error("Error adding post:", error);
      }
    },
    // DELETE POST
    // This function deletes a post by its ID
    // It first checks if the user is authenticated and retrieves their user ID
    async deletePost(postId: string) {
      const supabase = useNuxtApp().$supabase;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      const payload: DeletePostPayload = { postId, userId };

      try {
        const response = await $fetch<{ success: boolean }>("/api/posts", {
          method: "DELETE",
          body: payload,
        });

        if (!response.success) {
          throw new Error("Failed to delete post");
        }

        await this.fetchPosts();
        return response.success;
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    // FETCH COMMENTS FOR POST
    // This function fetches comments for a specific post
    // It takes the post ID as an argument and retrieves the comments from the API
    // It returns an array of comments
    async fetchComments(postId: string): Promise<Comment[]> {
      if (!postId) return [];
      try {
        const allComments = await $fetch<Comment[]>("/api/posts/comment", {
          method: "GET",
          query: { postId },
        });
        return allComments;
      } catch (error) {
        console.error("Could not fetch comments", error);
        throw new Error("Cannot get comments");
      }
    },
  },
});
