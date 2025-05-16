export interface FollowStatus {
  status: "followed" | "unfollowed" | "pending";
  targetUserId: string;
  followerId: string;
  createdAt: string;
}
export type FollowStatusType = "followed" | "unfollowed" | "pending";

export interface IsFollowingResponse {
  isFollowing: boolean;
  status: FollowStatusType;
}
export interface FollowAPIResponse {
  success: boolean;
  status?: "pending" | "followed" | "unfollowed";
  error?: Error | null;
}
export interface FollowUserPayload {
  userId: string;
  targetUserId: string;
  isPrivate: boolean;
}
export type FollowButtonText = "Unfollow" | "Follow" | "Pending";
