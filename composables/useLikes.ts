const user = useUserStore();
export function useLikes() {
  async function toggleLikePost(postId: string, likedByMe: boolean) {
    if (!likedByMe) {
      try {
        await $fetch("/api/posts/togglelike", {
          method: "POST",
          body: { userId: user.userId, postId },
        });
      } catch (error) {
        console.error("Could not like post", error);
        throw new Error("Could not like post");
      }
    } else {
      try {
        await $fetch("/api/posts/togglelike", {
          method: "DELETE",
          body: { userId: user.userId, postId },
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
