export function useComments() {
  let comments: any = ref([]);
  const loading = ref(false);
  async function fetchComments(postId: any) {
    if (!postId) {
      console.log("Could not get post Id");
      comments.value = [];
      return;
    }
    loading.value = true;
    try {
      const allComments = await $fetch("/api/posts/comment", {
        method: "GET",
        query: { postId },
      });
      comments.value = allComments;
      loading.value = false;
    } catch (error) {
      console.log("Could not get comments", error);
      throw new Error("Could not get comments for this post");
    }
  }
  async function addComment(userId: any, postId: any, commentText: any) {
    if (!userId || !postId || !commentText) {
      console.log("Could not get user Id, post Id or comment text");
      throw new Error("Could not get user Id, post Id or comment text");
    }
    loading.value = true;
    try {
      await $fetch("/api/posts/comment", {
        method: "POST",
        body: {
          userId,
          postId,
          commentText,
        },
      });
      comments.value.push({
        userId,
        postId,
        commentText,
      });
      comments.value = [...comments.value];
      return true;
    } catch (error) {
      console.log("Could not add comment", error);
      throw new Error("Could not add comment to this post");
    }
  }
  return {
    comments,
    loading,
    fetchComments,
    addComment,
  };
}
