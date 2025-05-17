import type { PostWithProfile, ToggleLikePayload } from "~/types/post";
import type { NotificationPayload } from "~/types/notification";
export function useLikes() {
  const user = useUserStore();
  const toast = useToast();
  const { toggleNotification } = useNotifications();
  async function toggleLikePost(postId: string, likedByMe: boolean) {
    if (!postId) return;
    const payload: ToggleLikePayload = {
      userId: user.userId as string,
      postId,
    };
    if (!user.userId) {
    }
    if (!likedByMe) {
      try {
        await $fetch("/api/posts/togglelike", {
          method: "POST",
          body: payload,
        });
      } catch (error) {
        console.error("Could not like post", error);
        throw new Error("Could not like post");
      }
    } else {
      try {
        await $fetch("/api/posts/togglelike", {
          method: "DELETE",
          body: payload,
        });
      } catch (error) {
        console.error("Could not unlike post", error);
        throw new Error("Could not unlike post");
      }
    }
  }
  async function handleLikePost(post: PostWithProfile) {
    if (!post) {
      console.error("Post is undefined");
      return;
    }
    try {
      await toggleLikePost(post.posts.id, post.posts.likedByMe ?? false);
      post.posts.likedByMe = !post.posts.likedByMe;
      post.posts.likesCount += post.posts.likedByMe ? 1 : -1;
      if (post.posts.likedByMe && post.profiles.id !== user.userId) {
        await toggleNotification(<NotificationPayload>{
          targetUserId: post.profiles.id,
          postId: post.posts.id,
          type: "like",
        });
      }
    } catch (err) {
      console.error("failed to like post");
      toast.error({
        message: "Failed to like post",
        timeout: 3000,
        position: "topRight",
      });
    }
  }
  return {
    handleLikePost,
    toggleLikePost,
  };
}
