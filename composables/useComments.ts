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
  const activeCommentId: any = ref(null);
  const showCommentOptions: any = ref(null);
  const user = useUserStore();
  const toast = useToast();
  // FETCH COMMENTS
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
  // ADD COMMENT
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
    loading.value = true;
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
      loading.value = false;
      return true;
    } catch (error) {
      console.error("Could not add comment", error);
      loading.value = false;
      comments.value = comments.value.filter(
        (c) => c.commentId !== optimisticComment.commentId
      );

      throw new Error("Could not add comment to this post.");
    }
  }
  // DELETE COMMENT
  async function deleteComment(commentId: string, postId: string) {
    if (!commentId || !postId) {
      console.error("Cannot delete comment: Missing commentId.");
      throw new Error("Missing commentId to delete comment.");
    }
    try {
      await $fetch("/api/posts/comment", {
        method: "DELETE",
        query: { commentId, postId },
      });
      return { success: true };
    } catch (error) {
      console.error("Could not delete comment", error);
      throw new Error("Could not delete comment.");
    }
  }
  // SET ACTIVE COMMENT ID
  function toggleCommentOptions(commentId: string) {
    if (activeCommentId.value === commentId) {
      activeCommentId.value = null;
      showCommentOptions.value = null;
    } else {
      activeCommentId.value = commentId;
      showCommentOptions.value = true;
    }
  }
  return {
    comments,
    loading,
    toggleCommentOptions,
    deleteComment,
    fetchComments,
    addComment,
  };
}
