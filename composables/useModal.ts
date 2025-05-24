import type { ModalComposable } from "@/types/modal";
import { ref, computed } from "vue";

const isOpen = ref(false);
const postId = ref<string | null>(null);
const commentInput = ref<string>("");
const activeCommentId = ref<string | null>(null);
const activePostOptionsId = ref<string | null>(null);
const fallbackImage = ref<string>(
  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
);

// ---- COMPOSABLE FUNCTION ----
export function useModal(): ModalComposable {
  const user = useUserStore();
  const posts = usePostsStore();
  const toast = useToast();

  const { comments, loading, fetchComments, deleteComment, addComment } =
    useComments();
  const { toggleLikePost } = useLikes();
  const { sendReport } = useReport();

  const activePost = computed(() => {
    return (
      posts.userPosts.find((p) => p.posts.id === postId.value) ||
      posts.allPosts.find((p) => p.posts.id === postId.value) ||
      null
    );
  });

  async function handleAddComment(): Promise<void> {
    const content = commentInput.value.trim();
    if (!content || !activePost.value?.posts.id || !user.userId) return;
    await addComment(user.userId, activePost.value.posts.id, content);
    commentInput.value = "";
    await fetchComments(activePost.value.posts.id);
  }

  async function handleDeleteComment(commentId: string): Promise<void> {
    try {
      await deleteComment(commentId, activePost.value?.posts.id!);
      toast.success({
        message: "Comment deleted successfully.",
        timeout: 3000,
        position: "topCenter",
      });
      activeCommentId.value = null;
      await fetchComments(activePost.value?.posts.id!);
    } catch (error) {
      toast.error({
        message: "Failed to delete comment.",
        timeout: 3000,
        position: "topCenter",
      });
      activeCommentId.value = null;
    }
  }

  async function handleLikePost(): Promise<void> {
    const post = activePost.value;
    if (!post || !post.posts.id || !user.userId) return;
    const currentStatus = post.posts.likedByMe;
    await toggleLikePost(post.posts.id, currentStatus);
    post.posts.likedByMe = !currentStatus;
    post.posts.likesCount += post.posts.likedByMe ? 1 : -1;
  }

  async function handleDeletePost(): Promise<boolean> {
    if (!activePost.value?.posts.id) return false;
    try {
      const success = await posts.deletePost(activePost.value.posts.id);
      if (success) {
        toast.success({
          message: "Post deleted successfully.",
          timeout: 3000,
          position: "topCenter",
        });
        closeModal();
        return true;
      }
    } catch {
      toast.error({
        message: "Failed to delete post.",
        timeout: 3000,
        position: "topCenter",
      });
      closeModal();
    }
    return false;
  }

  async function handleReport(): Promise<void> {
    if (!user.userId || !activePost.value?.posts.id) return;
    try {
      await sendReport(user.userId, activePost.value.posts.id);
      toast.success({
        message: "Reported successfully.",
        timeout: 3000,
        position: "topCenter",
      });
      activeCommentId.value = null;
      activePostOptionsId.value = null;
    } catch {
      toast.error({
        message: "Failed to report.",
        timeout: 3000,
        position: "topCenter",
      });
      activeCommentId.value = null;
    }
  }

  function toggleCommentOptions(commentId: string): void {
    activePostOptionsId.value = null;
    activeCommentId.value =
      activeCommentId.value === commentId ? null : commentId;
  }

  function togglePostOptions(id: string): void {
    activeCommentId.value = null;
    activePostOptionsId.value = activePostOptionsId.value === id ? null : id;
  }

  function openModal(postIdValue: string): void {
    postId.value = postIdValue;
    isOpen.value = true;
    if (postId.value) {
      fetchComments(postId.value);
    }
  }

  function closeModal(): void {
    isOpen.value = false;
    postId.value = null;
    commentInput.value = "";
    activeCommentId.value = null;
    activePostOptionsId.value = null;
  }

  return {
    // State
    isOpen,
    activePost,
    commentInput,
    comments,
    loading,
    activeCommentId,
    activePostOptionsId,
    fallbackImage,
    // Methods
    openModal,
    closeModal,
    handleAddComment,
    handleDeleteComment,
    handleLikePost,
    handleDeletePost,
    handleReport,
    toggleCommentOptions,
    togglePostOptions,
  };
}
