export interface Post {
  id: string;
  userId: string;
  contentText: string | null;
  contentImage: string | null;
  feeling: string | null;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  likesCount: number;
  likedByMe?: boolean;
}

// Profile structure linked with posts
export interface Profile {
  id: string;
  username: string;
  fullName: string | null;
  followingCount: number | 0;
  followersCount: number | 0;
  postsCount: number | 0;
  age: number | null;
  showAge?: boolean;
  profilePicture: string | null;
  bio?: string | null;
  isPrivate?: boolean;
}

// Combined Post and Profile for feed display
export interface PostWithProfile {
  posts: Post;
  likedByMe?: boolean;
  profiles: Profile;
  displayComment?: string | null;
}

// Comment structure
export interface Comment {
  commentId: string;
  commentText: string;
  commentCreatedAt: string;
  userId: string;
  username: string;
  profilePicture: string | null;
  postId: string;
}

// POST - Add new post
export interface CreatePostPayload {
  userId: string;
  contentText?: string;
  contentImage?: string | null;
  feeling?: string;
}

// DELETE - Delete post
export interface DeletePostPayload {
  userId: string;
  postId: string;
}

// POST - Toggle Like
export interface ToggleLikePayload {
  userId: string;
  postId: string;
}

// POST - Add comment
export interface CreateCommentPayload {
  userId: string;
  postId: string;
  commentText: string;
}

// DELETE - Delete comment
export interface DeleteCommentPayload {
  commentId: string;
  postId: string;
}

// POST - Report post
export interface ReportPostPayload {
  userId: string;
  postId: string;
}
export interface ReportPostResponse {
  success: boolean;
}
export interface ReportDetails {
  userId: string;
  postId: string;
}
// GET - Post details
export interface PostDetails {
  post: Post;
  profile: Profile;
}
