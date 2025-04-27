import { defineStore } from "pinia";
import prisma from "~/server/utils/prisma";

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

      const existingLike = await prisma.postLike.findFirst({
        where: {
          userId,
          postId,
        },
      });

      const post = this.allPosts.find((p) => p.id === postId);
      if (!post) return;

      if (existingLike) {
        await prisma.postLike.delete({
          where: {
            id: existingLike.id,
          },
        });
        post.likes_count = Math.max((post.likes_count || 1) - 1, 0);
        post.liked_by_me = false;
      } else {
        await prisma.postLike.create({
          data: {
            userId,
            postId,
          },
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
      try {
        const userPosts = await prisma.post.findMany({
          where: {
            userId,
          },
          orderBy: {
            created_at: "desc",
          },
        });

        this.userPosts = userPosts || [];
      } catch (error) {
        console.error("Fetch user posts error:", error.message);
      }

      // Fetch all posts for everyone
      try {
        const allPosts = await prisma.post.findMany({
          orderBy: {
            created_at: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                full_name: true,
                profile_picture: true,
              },
            },
          },
        });

        this.allPosts = allPosts || [];
      } catch (error) {
        console.error("Fetch all posts error:", error.message);
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
        await prisma.post.create({
          data: {
            userId,
            content_text: values.content,
            content_image: uploadedImageUrl,
            feeling: values.postFeeling,
          },
        });
      } catch (error) {
        console.error("Insert post error:", error.message);
      }
    },
  },
});
