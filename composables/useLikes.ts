import type { ToggleLikePayload } from "~/types/post";
export function useLikes() {
  const user = useUserStore();
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
  return {
    toggleLikePost,
  };
}
