import type { PostWithProfile, Post } from "~/types/post";

export function usePosts() {
  // STORES & COMPOSABLES
  const posts = usePostsStore();
  const user = useUserStore();
  const toast = useToast();
  const { comments, fetchComments, addComment, deleteComment, loading } =
    useComments();
  const { toggleNotification } = useNotifications();
  const { sendReport } = useReport();
  const { toggleLikePost } = useLikes();
  const { checkIfFollowing } = useFollow();
  const { getRandomComment } = useComments();
  // REFS
  const pending = ref<boolean>(false);
  const { userId } = toRefs(user);
  const postInfo = ref<PostWithProfile["posts"] | null>(null);
  const userInfo = ref<PostWithProfile["profiles"] | null>(null);
  const commentText = ref<string>("");
  const activePostId = ref<string | null>(null);
  const activeCommentId = ref<string | null>(null);
  const showCommentOptions = ref<boolean>(false);
  const showReport = ref<boolean>(false);
  const showComments = ref<boolean>(false);

  async function fetchHomePosts(): Promise<void> {
    pending.value = true;
    try {
      await posts.fetchPosts();
      const followChecks = posts.allPosts
        .filter((post) => post.profiles?.id)
        .map((post) => checkIfFollowing(post.profiles.id));
      await Promise.all([getRandomComment(), ...followChecks]);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      toast.error({
        message: "Failed to fetch posts",
        timeout: 3000,
        position: "topRight",
      });
    } finally {
      pending.value = false;
    }
  }
  async function fetchSinglePost(postId: string) {
    try {
      const { post, profile } = await $fetch(`/api/posts/${postId}`, {
        query: { userId: userId.value },
      });
      postInfo.value = post;
      userInfo.value = profile;
      await fetchComments(postId);
    } catch (error) {
      console.error("Could not fetch post", error);
      throw error;
    }
  }

  // LIKE POST
  async function likePost(post: PostWithProfile["posts"]) {
    try {
      await toggleLikePost(post.id, post.likedByMe ?? false);
      post.likedByMe = !post.likedByMe;
      post.likesCount += post.likedByMe ? 1 : -1;

      await toggleNotification({
        targetUserId: post.userId,
        postId: post.id,
        type: post.likedByMe ? "like" : "unlike",
      });
    } catch (error) {
      toast.error({
        message: "Failed to like post",
        position: "topRight",
        timeout: 3000,
      });
    }
  }

  // REPORT POST
  async function handleReport(postId: string) {
    try {
      await sendReport(userId.value as string, postId);
      toast.success({
        message: "Successfully reported",
        timeout: 3000,
        position: "topRight",
      });
      showReport.value = false;
      showCommentOptions.value = false;
    } catch (error) {
      toast.error({
        message: "Could not report post",
        timeout: 3000,
        position: "topRight",
      });
    }
  }

  // DELETE POST
  async function handleDeletePost(postId: string): Promise<boolean> {
    try {
      const success = await posts.deletePost(postId);
      if (success) {
        toast.success({
          message: "Post deleted successfully",
          timeout: 3000,
          position: "topCenter",
        });
        return true;
      }
    } catch (error) {
      toast.error({
        message: "Failed to delete post",
        timeout: 3000,
        position: "topCenter",
      });
    }
    return false;
  }

  // ADD COMMENT
  async function handleAddComment(postId: string) {
    const content = commentText.value.trim();
    try {
      await addComment(userId.value as string, postId, content);
      await toggleNotification({
        targetUserId: postInfo.value?.userId || "",
        postId: postId,
        type: "comment",
      });
      commentText.value = "";
      activeCommentId.value = null;
      showCommentOptions.value = false;
      toast.success({
        message: "Comment added successfully",
        position: "topRight",
        timeout: 3000,
      });
      await fetchComments(postId);
    } catch (error) {
      toast.error({
        message: "Failed to add comment",
        position: "topRight",
        timeout: 3000,
      });
    }
  }

  // DELETE COMMENT
  async function handleDeleteComment(commentId: string, postId: string) {
    try {
      await deleteComment(commentId, postId);
      toast.success({
        message: "Comment deleted successfully",
        timeout: 3000,
        position: "topRight",
      });
      showCommentOptions.value = false;
      activeCommentId.value = null;
      await fetchComments(postId);
    } catch (error) {
      toast.error({
        message: "Failed to delete comment",
        timeout: 3000,
        position: "topRight",
      });
    }
  }

  function togglePostOptions(postId: string) {
    activePostId.value = activePostId.value === postId ? null : postId;
  }

  function toggleCommentOptions(commentId: string) {
    activeCommentId.value =
      activeCommentId.value === commentId ? null : commentId;
    showCommentOptions.value = true;
  }
  return {
    // refs
    postInfo,
    userInfo,
    pending,
    commentText,
    activePostId,
    activeCommentId,
    showCommentOptions,
    showReport,
    showComments,

    // state
    comments,
    loading,

    // actions
    fetchSinglePost,
    fetchHomePosts,
    likePost,
    handleReport,
    handleDeletePost,
    handleAddComment,
    handleDeleteComment,
    togglePostOptions,
    toggleCommentOptions,
    fetchComments,
  };
}
