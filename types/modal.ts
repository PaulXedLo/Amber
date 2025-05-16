import type { Ref, ComputedRef } from "vue";
import type { PostWithProfile, Comment } from "~/types/post";

export interface ModalComposable {
  isOpen: Ref<boolean>;
  commentInput: Ref<string>;
  comments: Ref<Comment[]>;
  loading: Ref<boolean>;
  fallbackImage: Ref<string>;
  activePost: ComputedRef<PostWithProfile | null>;
  activeCommentId: Ref<string | null>;
  activePostOptionsId: Ref<string | null>;
  openModal: (postId: string) => void;
  closeModal: () => void;
  handleAddComment: () => Promise<void>;
  handleDeleteComment: (commentId: string) => Promise<void>;
  handleLikePost: () => Promise<void>;
  handleDeletePost: () => Promise<boolean>;
  handleReport: () => Promise<void>;
  toggleCommentOptions: (commentId: string) => void;
  togglePostOptions: (postId: string) => void;
}
