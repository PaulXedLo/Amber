import { ref } from "vue";
import { useUserStore } from "~/stores/user";

interface Comment {
  commentId?: string;
  commentText: string;
  commentCreatedAt?: string | Date;
  userId: string;
  username?: string;
  profilePicture?: string;
  postId: string;
}

export function useComments() {
  const comments = ref<Comment[]>([]);
  const loading = ref(false);
  const user = useUserStore();

  async function fetchComments(postId: string | number): Promise<Comment[]> {
    if (!postId) {
      console.warn("Cannot fetch comments: Post ID is missing.");
      comments.value = [];
      return [];
    }
    loading.value = true;
    let fetchedComments: Comment[] = [];
    try {
      fetchedComments = await $fetch("/api/posts/comment", {
        method: "GET",
        query: { postId },
      });

      fetchedComments.sort(
        (a, b) =>
          new Date(b.commentCreatedAt!).getTime() -
          new Date(a.commentCreatedAt!).getTime()
      );

      comments.value = fetchedComments;

      return fetchedComments;
    } catch (error) {
      console.error("Could not fetch comments", error);
      comments.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function addComment(
    userId: string,
    postId: string | number,
    commentText: string
  ) {
    if (!userId || !postId || !commentText.trim()) {
      console.error(
        "Cannot add comment: Missing userId, postId, or comment text."
      );
      throw new Error("Missing required information to add comment.");
    }

    const optimisticComment: Comment = {
      commentId: `temp-${Date.now()}`,
      userId,
      postId: String(postId),
      commentText: commentText.trim(),
      commentCreatedAt: new Date().toISOString(),
      username: user.username || "You",
      profilePicture: user.profilePic || "/placeholder-avatar.png",
    };
    comments.value.unshift(optimisticComment);

    try {
      const response = await $fetch("/api/posts/comment", {
        method: "POST",
        body: {
          userId,
          postId: String(postId),
          commentText: commentText.trim(),
        },
      });

      await fetchComments(postId);

      return true;
    } catch (error) {
      console.error("Could not add comment", error);

      comments.value = comments.value.filter(
        (c) => c.commentId !== optimisticComment.commentId
      );

      throw new Error("Could not add comment to this post.");
    }
  }

  return {
    comments,
    loading,
    fetchComments,
    addComment,
  };
}
